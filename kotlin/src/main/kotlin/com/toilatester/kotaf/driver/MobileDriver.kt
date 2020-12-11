package com.toilatester.kotaf.driver

import io.appium.java_client.ios.IOSDriver
import org.openqa.selenium.MutableCapabilities
import org.openqa.selenium.WebElement
import org.openqa.selenium.remote.RemoteWebDriver
import java.net.URL

object IOS : Driver {
    override fun createRemoteDriver(url: String, options: MutableCapabilities): RemoteWebDriver {
        return IOSDriver<WebElement>(URL(url), options)
    }
}

object Android : Driver
