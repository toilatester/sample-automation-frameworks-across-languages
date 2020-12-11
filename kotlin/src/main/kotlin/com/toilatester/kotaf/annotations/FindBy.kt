package com.toilatester.kotaf.annotations

import com.toilatester.kotaf.elements.Component
import kotlin.reflect.KClass

@Target(AnnotationTarget.FIELD)
@Retention(AnnotationRetention.RUNTIME)
annotation class FindBy(
    val id: String = "",
    val name: String = "",
    val className: String = "",
    val css: String = "",
    val tagName: String = "",
    val linkText: String = "",
    val partialLinkText: String = "",
    val xpath: String = "",
    val implementedBy: KClass<out Component> = Component::class
)
