package com.toilatester.kotaf.extensions

import com.toilatester.kotaf.driver.driver
import org.junit.jupiter.api.extension.ExtensionContext
import org.junit.jupiter.api.extension.TestExecutionExceptionHandler
import org.openqa.selenium.OutputType
import org.openqa.selenium.TakesScreenshot
import org.slf4j.LoggerFactory

class ScreenshotOnFailureHandler : TestExecutionExceptionHandler {
    private val logger = LoggerFactory.getLogger(this::class.java)

    override fun handleTestExecutionException(extensionContext: ExtensionContext, throwable: Throwable) {
        driver.manage().window().maximize()
        val screenshot = (driver as TakesScreenshot).getScreenshotAs(OutputType.BASE64)
        logger.error("RP_MESSAGE#BASE64#$screenshot#${throwable.message}")
        throw throwable
    }
}
