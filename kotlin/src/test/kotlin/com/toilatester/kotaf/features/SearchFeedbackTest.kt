package com.toilatester.kotaf.features

import com.automation.remarks.junit5.Video
import com.toilatester.kotaf.base.BaseGUI
import com.toilatester.kotaf.pages.HomePage
import com.toilatester.kotaf.pages.LoginPage
import com.toilatester.kotaf.pages.SearchPage
import com.toilatester.kotaf.utils.database
import io.kotlintest.matchers.collections.shouldHaveSize
import io.kotlintest.shouldBe
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Tag
import org.junit.jupiter.api.Test

class SearchFeedbackTest : BaseGUI() {
    private val searchPage by lazy { SearchPage() }
    private val homePage by lazy { HomePage() }

    init {
        database.connect()
    }

    @BeforeEach
    fun precondition() {
        LoginPage().apply {
            openPage()
            loginByCredentials("nierautomata", "sampleapp")
        }
    }

    @Test
    @Tag("Smoke")
    fun `Verify my feedback list`() {
        homePage.menuBar.goToSearchPage()
        val feedbackInDB = searchPage.getFeedbacksForOthersFromDB(providerId = 2153)
        val feedbacks = with(searchPage) {
            viewOptionDropDown.selectOptionByVisibleText("My feedbacks for Others")
            enableAllStatus()
            doSearch()
            getAllReturnedFeedback()
        }
        feedbacks shouldHaveSize feedbackInDB.size
        feedbacks shouldBe feedbackInDB
    }

    @Test
    fun `Verify search success message`() {
        homePage.menuBar.goToSearchPage()
        searchPage.apply {
            viewOptionDropDown.selectOptionByVisibleText("My feedbacks for Others")
            enableAllStatus()
            doSearch()
            searchSuccessMessage shouldBe "Search Successfully."
        }
    }
}
