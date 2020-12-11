package com.toilatester.kotaf.pages

import com.toilatester.kotaf.annotations.OverrideWith
import com.toilatester.kotaf.base.BasePage
import com.toilatester.kotaf.components.PAInputField
import com.toilatester.kotaf.elements.components.InputField
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

class LoginPage : BasePage() {
    @FindBy(linkText = "Login By Credentials")
    lateinit var credentialsTab: WebElement

    @FindBy(id = "username")
    @OverrideWith(PAInputField::class)
    lateinit var usernameInputField: InputField

    @FindBy(id = "password")
    lateinit var passwordInputField: InputField

    @FindBy(id = "btnSubmit")
    lateinit var loginButton: WebElement

    @FindBy(id = "pageMessage")
    lateinit var errorMessage: WebElement

    @FindBy(css = "#noty_topCenter_layout_container li:last-child")
    lateinit var popupErrorMessage: WebElement

    fun loginByCredentials(username: String, password: String) {
        credentialsTab.click()
        usernameInputField.clearAndInput(username)
        passwordInputField.clearAndInput(password)
        loginButton.click()
    }
}
