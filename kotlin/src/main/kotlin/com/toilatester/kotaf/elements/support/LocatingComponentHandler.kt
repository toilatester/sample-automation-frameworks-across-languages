package com.toilatester.kotaf.elements.support

import com.toilatester.kotaf.elements.Component
import com.toilatester.kotaf.elements.factory.createComponent
import com.toilatester.kotaf.elements.invoke
import org.openqa.selenium.NoSuchElementException
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.pagefactory.ElementLocator
import java.lang.reflect.Field
import java.lang.reflect.InvocationHandler
import java.lang.reflect.Method

class LocatingComponentHandler(
    private val locator: ElementLocator,
    private val componentType: Class<*>,
    private val field: Field
) : InvocationHandler {

    @Suppress("UNCHECKED_CAST")
    override fun invoke(proxy: Any, method: Method, args: Array<out Any>?): Any? {
        val element: WebElement = try {
            locator.findElement()
        } catch (e: NoSuchElementException) {
            if ("toString" == method.name) return "Proxy wrappers for: $locator"
            throw NoSuchElementException("No element matching locator : $locator.")
        }

        if ("getWrappedElement" == method.name) return element

        return when (componentType) {
            WebElement::class.java -> element.invoke(method, args)
            else -> {
                createComponent(
                    componentType as Class<out Component>,
                    element,
                    field
                ).invoke(method, args)
            }
        }
    }
}
