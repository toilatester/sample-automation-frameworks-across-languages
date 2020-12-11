package com.toilatester.kotaf.components

import com.toilatester.kotaf.data.Feedback
import com.toilatester.kotaf.data.Status
import com.toilatester.kotaf.elements.BaseComponent
import com.toilatester.kotaf.elements.Component
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

interface FeedbackEntity : Component {
    fun getFeedback(): Feedback
}

class FeedbackEntityImpl(override val wrappedElement: WebElement) : BaseComponent(wrappedElement), FeedbackEntity {

    override fun getFeedback(): Feedback =
        Feedback(
            receiverName = receiverNameText.text,
            providedDate = dateText.text,
            status = Status.valueOf(statusText.text.toUpperCase()),
            isShared = isSharedCheckBox.isSelected,
            providerName = providerNameText.text.trim()
        )

    @FindBy(xpath = ".//td[@aria-describedby = 'list_cb']/input")
    lateinit var selectCheckBox: WebElement

    @FindBy(xpath = ".//td[@aria-describedby = 'list_Fullname']")
    lateinit var receiverNameText: WebElement

    @FindBy(xpath = ".//td[@aria-describedby = 'list_Date']")
    lateinit var dateText: WebElement

    @FindBy(xpath = ".//td[@aria-describedby = 'list_StatusText']")
    lateinit var statusText: WebElement

    @FindBy(xpath = ".//td[@aria-describedby = 'list_IsShared']/input")
    lateinit var isSharedCheckBox: WebElement

    @FindBy(xpath = ".//td[@aria-describedby = 'list_ProviderName']")
    lateinit var providerNameText: WebElement
}
