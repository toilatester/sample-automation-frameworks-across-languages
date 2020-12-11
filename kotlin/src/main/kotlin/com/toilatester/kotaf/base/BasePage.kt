package com.toilatester.kotaf.base

import com.toilatester.kotaf.configuration
import com.toilatester.kotaf.driver.driver
import com.toilatester.kotaf.elements.support.ComponentFieldDecorator
import org.openqa.selenium.support.PageFactory

@Suppress("LeakingThis")
open class BasePage {
    private val baseURL: String = configuration.string("applicationUrl") ?: ""
    open val path: String = ""

    init {
        PageFactory.initElements(ComponentFieldDecorator(driver), this)
    }

    fun openPage() {
        driver.get(baseURL + path)
    }

    fun getCurrentPageTitle(): String = driver.title
    fun getCurrentURL(): String = driver.currentUrl
}
