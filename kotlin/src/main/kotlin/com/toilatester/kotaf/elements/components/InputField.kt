package com.toilatester.kotaf.elements.components

import com.toilatester.kotaf.elements.BaseComponent
import com.toilatester.kotaf.elements.Component
import org.openqa.selenium.WebElement

interface InputField : Component {
    fun clearAndInput(vararg chars: CharSequence?)
}

class InputFieldImpl(override val wrappedElement: WebElement) : BaseComponent(wrappedElement), InputField {
    @Suppress("Occasionally use of Spread(*) operator")
    override fun clearAndInput(vararg chars: CharSequence?) {
        this.clear()
        chars.forEach {
            this.sendKeys(it)
        }
    }
}
