package com.toilatester.kotaf.driver

import org.openqa.selenium.MutableCapabilities
import org.openqa.selenium.remote.BrowserType
import org.openqa.selenium.remote.DesiredCapabilities
import org.openqa.selenium.remote.RemoteWebDriver

val driver: RemoteWebDriver
    get() = DriverFactory.getDriver()

class DriverFactory {
    companion object {
        private var localDriver = ThreadLocal<RemoteWebDriver>()
        fun initDriver(
            browser: String = BrowserType.CHROME,
            options: MutableCapabilities = DesiredCapabilities(),
            remoteURL: String = "",
            path: String = ""
        ) =
            if (remoteURL.isEmpty()) initLocalDriver(browser, path, options)
            else initRemoteDriver(browser, remoteURL, options)

        fun terminateDriver() {
            localDriver.get().quit()
            localDriver.remove()
        }

        fun getDriver(): RemoteWebDriver = localDriver.get()

        private fun initLocalDriver(browser: String, path: String, options: MutableCapabilities) {
            localDriver.set(browser.toDriver().createDriver(path, options))
        }

        private fun initRemoteDriver(browser: String, url: String, options: MutableCapabilities) {
            localDriver.set(browser.toDriver().createRemoteDriver(url, options))
        }

        private fun String.toDriver(): Driver {
            return when (this) {
                BrowserType.CHROME, BrowserType.GOOGLECHROME -> Chrome
                BrowserType.FIREFOX -> Firefox
                BrowserType.IPHONE, BrowserType.IPAD, "ios", "IOS" -> IOS
                else -> throw IllegalArgumentException("Does not support '$this' browser.")
            }
        }
    }
}
