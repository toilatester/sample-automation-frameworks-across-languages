package com.toilatester.kotaf.driver

import com.toilatester.kotaf.utils.getResourcesPath
import org.openqa.selenium.MutableCapabilities
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.firefox.FirefoxOptions
import org.openqa.selenium.remote.RemoteWebDriver

object Chrome : Driver {
    override fun createDriver(path: String, options: MutableCapabilities): RemoteWebDriver {
        System.setProperty("webdriver.chrome.driver",
            path.ifEmpty { getResourcesPath(relativePath = "driver/chromedriver") })
        return ChromeDriver(ChromeOptions().apply { merge(options) })
    }
}

object Firefox : Driver {
    override fun createDriver(path: String, options: MutableCapabilities): RemoteWebDriver {
        System.setProperty("webdriver.gecko.driver",
            path.ifEmpty { getResourcesPath(relativePath = "driver/geckodriver") })
        return FirefoxDriver(FirefoxOptions().apply { merge(options) })
    }
}
