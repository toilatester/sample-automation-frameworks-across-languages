package com.toilatester.kotaf.extensions

import com.toilatester.kotaf.annotations.ExecuteWith
import com.toilatester.kotaf.configuration
import com.toilatester.kotaf.driver.DriverFactory
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.extension.ExtensionContext
import org.junit.jupiter.api.extension.InvocationInterceptor
import org.junit.jupiter.api.extension.ReflectiveInvocationContext
import org.junit.platform.commons.support.AnnotationSupport
import org.openqa.selenium.MutableCapabilities
import org.openqa.selenium.remote.BrowserType
import org.openqa.selenium.remote.DesiredCapabilities
import java.lang.reflect.Method

class DriverInterceptor : InvocationInterceptor {
    override fun interceptBeforeEachMethod(
        invocation: InvocationInterceptor.Invocation<Void>,
        invocationContext: ReflectiveInvocationContext<Method>,
        extensionContext: ExtensionContext
    ) {
        doInitDriver(invocationContext, extensionContext)
        invocation.proceed()
    }

    override fun interceptAfterEachMethod(
        invocation: InvocationInterceptor.Invocation<Void>,
        invocationContext: ReflectiveInvocationContext<Method>,
        extensionContext: ExtensionContext
    ) {
        invocation.proceed()
        doTerminateDriver(invocationContext, extensionContext)
    }

    private fun doInitDriver(
        invocationContext: ReflectiveInvocationContext<Method>,
        extensionContext: ExtensionContext
    ) {
        with(extensionContext.getStore(ExtensionContext.Namespace.GLOBAL)) {
            val isDriverNotInit = getOrComputeIfAbsent("isDriverNotInit", { _ -> true }) as Boolean
            if (isDriverNotInit) {
                DriverFactory.initDriver(
                    browser = getExecuteBrowser(invocationContext),
                    options = buildCapabilities(invocationContext),
                    path = configuration.string("driverPath") ?: "",
                    remoteURL = configuration.string("remoteURL") ?: ""
                )
                put("isDriverNotInit", false)
            }
        }
    }

    private fun doTerminateDriver(
        invocationContext: ReflectiveInvocationContext<Method>,
        extensionContext: ExtensionContext
    ) {
        with(extensionContext.getStore(ExtensionContext.Namespace.GLOBAL)) {
            getOrComputeIfAbsent("terminateCountDown",
                { _ ->
                    invocationContext
                        .targetClass
                        .methods
                        .count { it.isAnnotationPresent(AfterEach::class.java) }
                }) as Int
            put("terminateCountDown", (get("terminateCountDown") as Int) - 1)
            if ((get("terminateCountDown") as Int) == 0) DriverFactory.terminateDriver()
        }
    }

    private fun buildCapabilities(invocationContext: ReflectiveInvocationContext<Method>): MutableCapabilities {
        val capabilitiesName = getExecutionInfo(invocationContext)
            .getOrDefault("capabilities", "capabilities")
        val cap = configuration.obj(capabilitiesName)
        return DesiredCapabilities().apply {
            cap?.let {
                it.forEach { key, value ->
                    setCapability(key, value)
                }
            }
        }
    }

    private fun getExecuteBrowser(invocationContext: ReflectiveInvocationContext<Method>): String =
        getExecutionInfo(invocationContext)["browser"]
            ?: System.getProperty("browser")
            ?: configuration.string("driver")
            ?: BrowserType.CHROME

    private fun getExecutionInfo(invocationContext: ReflectiveInvocationContext<Method>): MutableMap<String, String> {
        val executionInfo: MutableMap<String, String> = mutableMapOf()
        AnnotationSupport.findAnnotation(
            invocationContext.targetClass,
            ExecuteWith::class.java
        ).apply {
            ifPresent { annotation: ExecuteWith ->
                val errorMsg = "Please specify the browser to be executed with $annotation."
                executionInfo["browser"] =
                    annotation
                        .browser
                        .ifEmpty {
                            throw IllegalArgumentException(errorMsg)
                        }
                executionInfo["capabilities"] =
                    annotation.capabilitiesName.ifEmpty { "capabilities" }
            }
        }
        return executionInfo
    }
}
