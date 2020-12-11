package com.toilatester.kotaf.annotations

@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class ExecuteWith(
    val browser: String = "",
    val capabilitiesName: String = ""
)
