package com.toilatester.kotaf.elements.factory

import com.toilatester.kotaf.annotations.OverrideWith
import com.toilatester.kotaf.elements.Component
import com.toilatester.kotaf.elements.support.ComponentFieldDecorator
import org.junit.platform.commons.support.AnnotationSupport
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.PageFactory
import org.slf4j.LoggerFactory
import java.lang.reflect.Field
import kotlin.reflect.KClass
import kotlin.reflect.full.isSubclassOf
import kotlin.reflect.full.primaryConstructor

@Suppress("UNCHECKED_CAST")
fun <T : Component> createComponent(elementClass: Class<T>, wrappedElement: WebElement, field: Field): T {
    var implCls: KClass<out T> = Class.forName("${elementClass.name}Impl").kotlin as KClass<out T>
    AnnotationSupport.findAnnotation(field, OverrideWith::class.java).apply {
        ifPresent {
            it.implementation.run {
                if (isSubclassOf(elementClass.kotlin)) implCls = this as KClass<out T>
                else LoggerFactory
                    .getLogger(elementClass)
                    .debug("Use default implementation for ${elementClass.simpleName}.")
            }
        }
    }
    return implCls.primaryConstructor?.call(wrappedElement)?.apply {
        PageFactory.initElements(ComponentFieldDecorator(wrappedElement), this)
    } ?: throw IllegalArgumentException("No valid primary constructor found.")
}
