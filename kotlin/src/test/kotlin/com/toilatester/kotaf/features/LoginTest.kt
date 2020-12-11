package com.toilatester.kotaf.features

import com.toilatester.kotaf.annotations.ExecuteWith
import com.toilatester.kotaf.base.BaseGUI
import com.toilatester.kotaf.pages.HomePage
import com.toilatester.kotaf.pages.LoginPage
import io.kotlintest.shouldBe
import org.junit.jupiter.api.Tag
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import org.openqa.selenium.remote.BrowserType

@ExecuteWith(BrowserType.CHROME)
class LoginTest : BaseGUI() {
    private val loginPage: LoginPage by lazy { LoginPage() }
    private val homePage: HomePage by lazy { HomePage() }

    @Test
    @Tag("Smoke")
    fun `Login Success and Logout Success`() {
        loginPage.openPage()
        loginPage.loginByCredentials("nierautomata", "sampleapp")
        homePage.getCurrentPageTitle() shouldBe "Home | Sample Tool"
        homePage.isAvatarDisplayed shouldBe true
        homePage.logout()
        homePage.isAvatarDisplayed shouldBe false
    }

    @ParameterizedTest
    @CsvSource(
        "thao,sampleapp",
        "th,sampleapp",
        "t,sampleapp"
    )
    fun `Login with invalid credentials`(username: String, password: String) {
        loginPage.openPage()
        loginPage.loginByCredentials(username, password)
        loginPage.errorMessage.text shouldBe "Incorrect credentials, please try again."
    }

    @ParameterizedTest
    @CsvSource(
        "'','', Username may not be empty.",
        "'',sampleapp, Username may not be empty.",
        "t,'', Password may not be empty."
    )
    fun `Login with blank credentials`(username: String, password: String, expectedMsg: String) {
        loginPage.openPage()
        loginPage.loginByCredentials(username, password)
        loginPage.popupErrorMessage.getAttribute("innerText") shouldBe expectedMsg
    }
}
