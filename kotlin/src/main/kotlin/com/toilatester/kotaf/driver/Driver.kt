package com.toilatester.kotaf.driver

import org.openqa.selenium.MutableCapabilities
import org.openqa.selenium.remote.RemoteWebDriver
import java.net.URL

interface Driver {
    /*
    TODO : fallback in case the URL is empty
     */
    fun createDriver(path: String, options: MutableCapabilities): RemoteWebDriver =
        createRemoteDriver("", options)

    fun createRemoteDriver(url: String, options: MutableCapabilities): RemoteWebDriver =
        RemoteWebDriver(URL(url), options)
}
