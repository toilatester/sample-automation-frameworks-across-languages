package com.toilatester.kotaf.pages

import com.toilatester.kotaf.base.BasePage
import com.toilatester.kotaf.components.MenuBar
import org.openqa.selenium.NoSuchElementException
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

class HomePage : BasePage() {
    @FindBy(css = ".user_cpanel img")
    lateinit var userAvatar: WebElement

    @FindBy(css = ".user_cpanel a")
    lateinit var logoutLink: WebElement

    @FindBy(id = "menu")
    lateinit var menuBar: MenuBar

    val isAvatarDisplayed: Boolean
        get() {
            return try {
                userAvatar.isDisplayed
            } catch (e: NoSuchElementException) {
                false
            }
        }
    fun logout() = logoutLink.click()
}
