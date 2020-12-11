package com.toilatester.kotaf.elements

import com.toilatester.kotaf.elements.support.ElementHighlighter
import org.openqa.selenium.By
import org.openqa.selenium.Dimension
import org.openqa.selenium.OutputType
import org.openqa.selenium.WebElement
import org.openqa.selenium.Rectangle
import org.openqa.selenium.Point

import java.lang.reflect.InvocationTargetException
import java.lang.reflect.Method

operator fun WebElement.invoke(method: Method, args: Array<out Any>?): Any? {
    return ElementHighlighter.highlight(this) { invokeMethod(this, method, args) }
}

interface Component : WebElement {
    val wrappedElement: WebElement
    operator fun invoke(method: Method, args: Array<out Any>?): Any? = invokeMethod(this, method, args)
}

open class BaseComponent(override val wrappedElement: WebElement) : Component {
    override fun isDisplayed(): Boolean = wrappedElement.isDisplayed
    override fun clear() = wrappedElement.clear()
    override fun submit() = wrappedElement.submit()
    override fun getLocation(): Point = wrappedElement.location
    override fun <X : Any?> getScreenshotAs(outputType: OutputType<X>?): X = wrappedElement.getScreenshotAs(outputType)
    override fun <T : WebElement?> findElement(by: By?): T = wrappedElement.findElement<T>(by)
    override fun click() = wrappedElement.click()
    override fun getTagName(): String = wrappedElement.tagName
    override fun getSize(): Dimension = wrappedElement.size
    override fun getText(): String = wrappedElement.text
    override fun isSelected(): Boolean = wrappedElement.isSelected
    override fun isEnabled(): Boolean = wrappedElement.isEnabled
    override fun sendKeys(vararg chars: CharSequence?) = wrappedElement.sendKeys(*chars)
    override fun getAttribute(attrName: String?): String = wrappedElement.getAttribute(attrName)
    override fun getRect(): Rectangle = wrappedElement.rect
    override fun getCssValue(attrName: String?): String = wrappedElement.getCssValue(attrName)
    override fun <T : WebElement?> findElements(by: By?): MutableList<T> = wrappedElement.findElements<T>(by)

    override operator fun invoke(method: Method, args: Array<out Any>?): Any? =
        ElementHighlighter.highlight(wrappedElement) { invokeMethod(this, method, args) }
}

fun invokeMethod(obj: Any, method: Method, args: Array<out Any>?): Any? {
    return try {
        method.invoke(obj, *args.orEmpty())
    } catch (e: InvocationTargetException) {
        throw e
    }
}
