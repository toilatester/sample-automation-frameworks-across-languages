package com.toilatester.kotaf.components

import com.toilatester.kotaf.data.Feedback
import com.toilatester.kotaf.driver.driver
import com.toilatester.kotaf.elements.BaseComponent
import com.toilatester.kotaf.elements.Component
import org.openqa.selenium.By
import org.openqa.selenium.StaleElementReferenceException
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy
import org.openqa.selenium.support.ui.ExpectedConditions
import org.openqa.selenium.support.ui.WebDriverWait

interface FeedbackGrid : Component {
    fun getAllFeedbacksInCurrentPage(): List<Feedback>
}

class FeedbackGridImpl(override val wrappedElement: WebElement) : BaseComponent(wrappedElement), FeedbackGrid {
    @FindBy(css = ".jqgrow[role='row']")
    lateinit var feedbacks: List<FeedbackEntity>

    override fun getAllFeedbacksInCurrentPage(): List<Feedback> {
        return try {
            WebDriverWait(
                driver,
                10
            ).until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.cssSelector(".jqgrow[role='row']")))

            feedbacks.map { it.getFeedback() }.toList()
        } catch (e: StaleElementReferenceException) {
            /*
            Retry once
             */
            feedbacks.map { it.getFeedback() }.toList()
        }
    }
}
