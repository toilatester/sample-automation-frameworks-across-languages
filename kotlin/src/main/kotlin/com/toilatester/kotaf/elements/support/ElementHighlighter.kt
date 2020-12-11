package com.toilatester.kotaf.elements.support

import com.toilatester.kotaf.ELEMENT_TIMEOUT
import com.toilatester.kotaf.driver.driver
import org.openqa.selenium.JavascriptExecutor
import org.openqa.selenium.StaleElementReferenceException
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.ui.ExpectedConditions
import org.openqa.selenium.support.ui.WebDriverWait
import org.slf4j.LoggerFactory

object ElementHighlighter {
    fun highlight(element: WebElement, f: () -> Any?): Any? {
        element.getAttribute("style").run {
            highlighter(element, "border: 5px solid red;")
            val value = f()
            try {
                highlighter(element, this)
            } catch (e: StaleElementReferenceException) {
                LoggerFactory.getLogger(this::class.java).warn("Cannot unhighlight $element due to page transition.")
            }
            return value
        }
    }

    private val highlighter = fun(element: WebElement, style: String) {
        driver.let {
            (it as JavascriptExecutor).executeScript(
                "arguments[0].setAttribute('style', arguments[1]);",
                element,
                style
            )
            WebDriverWait(it, ELEMENT_TIMEOUT).until(ExpectedConditions.visibilityOf(element))
        }
    }
}
