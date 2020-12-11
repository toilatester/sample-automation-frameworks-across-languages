package com.toilatester.kotaf.components

import com.toilatester.kotaf.elements.BaseComponent
import com.toilatester.kotaf.elements.Component
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

interface MenuBar : Component {
    fun goToSearchPage()
}

class MenuBarImpl(override val wrappedElement: WebElement) : BaseComponent(wrappedElement), MenuBar {

    @FindBy(linkText = "View Feedbacks")
    lateinit var viewFeedbacksOption: WebElement

    @FindBy(linkText = "Search All")
    lateinit var searchAllOption: WebElement

    override fun goToSearchPage() {
        viewFeedbacksOption.click()
        searchAllOption.click()
    }
}
