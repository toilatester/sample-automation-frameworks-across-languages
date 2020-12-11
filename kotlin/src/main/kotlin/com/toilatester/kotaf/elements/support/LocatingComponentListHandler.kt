package com.toilatester.kotaf.elements.support

import com.toilatester.kotaf.elements.Component
import com.toilatester.kotaf.elements.factory.createComponent
import com.toilatester.kotaf.elements.invoke
import com.toilatester.kotaf.elements.invokeMethod
import org.openqa.selenium.WebElement
import org.openqa.selenium.WrapsElement
import org.openqa.selenium.interactions.Locatable
import org.openqa.selenium.support.pagefactory.ElementLocator
import java.lang.reflect.Field
import java.lang.reflect.InvocationHandler
import java.lang.reflect.Method
import java.lang.reflect.Proxy

@Suppress("UNCHECKED_CAST")
class LocatingComponentListHandler(
    private val locator: ElementLocator,
    private val componentType: Class<*>,
    private val field: Field,
    private val loader: ClassLoader
) : InvocationHandler {

    override fun invoke(proxy: Any, method: Method, args: Array<out Any>?): Any? {
        val elements: MutableList<WebElement> = locator.findElements()
        return when (componentType) {
            WebElement::class.java -> {
                createProxyForNestedComponents(componentType, elements)
                invokeMethod(elements, method, args)
            }
            else -> {
                elements.map { element ->
                    createComponent(
                        componentType as Class<out Component>,
                        element,
                        field
                    )
                }.toMutableList().run {
                    createProxyForNestedComponents(componentType as Class<Component>, this)
                    invokeMethod(this, method, args)
                }
            }
        }
    }

    private fun <T> createProxyForNestedComponents(componentType: Class<T>, components: MutableList<T>) {
        for (index in 0 until components.size) {
            components[index] = Proxy.newProxyInstance(
                loader,
                arrayOf(componentType, WrapsElement::class.java, Locatable::class.java),
                getNestedItemHandler(components[index], componentType)
            ) as T
        }
    }

    private fun <T> getNestedItemHandler(component: T, componentType: Class<T>): InvocationHandler {
        return when (componentType) {
            WebElement::class.java -> LocatingNestedElementHandler(component as WebElement)
            else -> LocatingNestedComponentHandler(component as Component)
        }
    }

    inner class LocatingNestedElementHandler(private val element: WebElement) : InvocationHandler {
        override fun invoke(proxy: Any, method: Method, args: Array<out Any>?): Any? {
            return element(method, args)
        }
    }

    inner class LocatingNestedComponentHandler(private val component: Component) : InvocationHandler {
        override fun invoke(proxy: Any, method: Method, args: Array<out Any>?): Any? {
            return component(method, args)
        }
    }
}
