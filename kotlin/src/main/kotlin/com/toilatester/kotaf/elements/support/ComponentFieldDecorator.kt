package com.toilatester.kotaf.elements.support

import com.toilatester.kotaf.elements.Component
import org.openqa.selenium.SearchContext
import org.openqa.selenium.WebElement
import org.openqa.selenium.WrapsElement
import org.openqa.selenium.interactions.Locatable
import org.openqa.selenium.support.FindAll
import org.openqa.selenium.support.FindBy
import org.openqa.selenium.support.FindBys
import org.openqa.selenium.support.pagefactory.DefaultElementLocatorFactory
import org.openqa.selenium.support.pagefactory.ElementLocator
import org.openqa.selenium.support.pagefactory.ElementLocatorFactory
import org.openqa.selenium.support.pagefactory.FieldDecorator
import java.lang.reflect.Field
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Proxy
import kotlin.reflect.KClass
import com.toilatester.kotaf.annotations.FindBy as FindByComponent

class ComponentFieldDecorator(
    searchContext: SearchContext,
    private val factory: ElementLocatorFactory = DefaultElementLocatorFactory(searchContext)
) : FieldDecorator {
    override fun decorate(loader: ClassLoader, field: Field): Any? {
        return if (isDecoratableField(field)) {
            val locator: ElementLocator = factory.createLocator(field)
            when {
                field canBeAssignedTo WebElement::class || field canBeAssignedTo Component::class ->
                    proxyForLocator(field.type, loader, locator, field)
                field canBeAssignedTo List::class -> proxyForListLocator(getListType(field), loader, locator, field)
                else -> null
            }
        } else null
    }

    private fun isDecoratableField(field: Field): Boolean {
        return isFindByAnnotationPresent(field) &&
                (field canBeAssignedTo WebElement::class ||
                        field canBeAssignedTo Component::class ||
                        isDecoratableList(field))
    }

    private fun isDecoratableList(field: Field): Boolean {
        if (field canBeAssignedTo List::class) {
            with(field.genericType) {
                if (this is ParameterizedType) {
                    return WebElement::class.java.isAssignableFrom(getListType(field))
                }
            }
        }
        return false
    }

    private fun getListType(field: Field): Class<*> {
        return with(field.genericType as ParameterizedType) {
            actualTypeArguments[0].run {
                Class.forName(typeName.split(" ").last())
            }
        }
    }

    private fun isFindByAnnotationPresent(field: Field): Boolean =
        with(field) {
            isAnnotationPresent(FindBy::class.java) ||
                    isAnnotationPresent(FindBys::class.java) ||
                    isAnnotationPresent(FindAll::class.java) ||
                    isAnnotationPresent(FindByComponent::class.java)
        }

    private infix fun Field.canBeAssignedTo(clazz: KClass<*>): Boolean {
        return clazz.javaObjectType.isAssignableFrom(this.type)
    }

    @Suppress("UNCHECKED_CAST")
    private fun <T> proxyForLocator(
        componentType: Class<T>,
        loader: ClassLoader?,
        locator: ElementLocator,
        field: Field
    ): T =
        Proxy.newProxyInstance(
            loader,
            arrayOf(componentType, WrapsElement::class.java, Locatable::class.java),
            LocatingComponentHandler(locator, componentType, field)
        ) as T

    @Suppress("UNCHECKED_CAST")
    private fun <T> proxyForListLocator(
        componentType: Class<T>,
        loader: ClassLoader,
        locator: ElementLocator,
        field: Field
    ): List<T> =
        Proxy.newProxyInstance(
            loader,
            arrayOf(List::class.java),
            LocatingComponentListHandler(locator, componentType, field, loader)
        ) as List<T>
}
