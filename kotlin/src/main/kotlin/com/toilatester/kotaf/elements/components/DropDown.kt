package com.toilatester.kotaf.elements.components

import com.toilatester.kotaf.elements.BaseComponent
import com.toilatester.kotaf.elements.Component
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.ui.Select

interface DropDown : Component {
    fun selectOptionByVisibleText(text: String)
}

class DropDownImpl(override val wrappedElement: WebElement) : BaseComponent(wrappedElement), DropDown {
    private var selector: Select = Select(wrappedElement)
    override fun selectOptionByVisibleText(text: String) {
        selector.selectByVisibleText(text)
    }
}
