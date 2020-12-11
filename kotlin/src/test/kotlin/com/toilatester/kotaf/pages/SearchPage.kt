package com.toilatester.kotaf.pages

import com.toilatester.kotaf.base.BasePage
import com.toilatester.kotaf.components.FeedbackGrid
import com.toilatester.kotaf.data.EmployeeTable
import com.toilatester.kotaf.data.Feedback
import com.toilatester.kotaf.data.FeedbackTable
import com.toilatester.kotaf.elements.components.DropDown
import org.jetbrains.exposed.sql.JoinType
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

class SearchPage : BasePage() {
    override val path: String
        get() = "/Feedbacks/SearchFull"

    @FindBy(id = "viewOption")
    lateinit var viewOptionDropDown: DropDown

    @FindBy(xpath = "//*[@name = 'Statuses']")
    lateinit var statusCheckBoxes: List<WebElement>

    @FindBy(id = "btnSearch")
    lateinit var searchButton: WebElement

    @FindBy(id = "next")
    lateinit var nextPageIcon: WebElement

    @FindBy(id = "list")
    lateinit var feedbackGrid: FeedbackGrid

    @FindBy(css = ".noty_text")
    lateinit var popupSuccessMessage: WebElement
    val searchSuccessMessage: String
        get() = popupSuccessMessage.text.trim()

    fun enableAllStatus() {
        statusCheckBoxes.firstOrNull { !it.isSelected }?.click()
    }

    fun doSearch() {
        searchButton.click()
    }

    fun getAllReturnedFeedback(): MutableList<Feedback> {
        return mutableListOf<Feedback>().apply {
            addAll(feedbackGrid.getAllFeedbacksInCurrentPage())
            if (!nextPageIcon.getAttribute("class").contains("ui-state-disabled")) {
                nextPageIcon.click()
                addAll(feedbackGrid.getAllFeedbacksInCurrentPage())
            }
        }
    }

    fun getFeedbacksForOthersFromDB(providerId: Int): MutableList<Feedback> =
        transaction {
            FeedbackTable.join(
                EmployeeTable, joinType = JoinType.INNER,
                onColumn = FeedbackTable.receiverId, otherColumn = EmployeeTable.employeeId
            )
                .slice(
                    EmployeeTable.employeeFullName, FeedbackTable.providerName,
                    FeedbackTable.status, FeedbackTable.isShared, FeedbackTable.providedDate
                )
                .select {
                    FeedbackTable.providerId eq providerId and
                            (FeedbackTable.providerId neq FeedbackTable.receiverId)
                }
                .orderBy(FeedbackTable.groupId to SortOrder.DESC)
                .groupBy(FeedbackTable.groupId).map {
                    Feedback(
                        providerName = it[FeedbackTable.providerName].trim(),
                        receiverName = it[EmployeeTable.employeeFullName],
                        status = it[FeedbackTable.status],
                        isShared = it[FeedbackTable.isShared],
                        providedDate = it[FeedbackTable.providedDate].toString("MM/dd/yyyy")
                    )
                }.toMutableList()
        }
}
