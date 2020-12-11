using System;
using OpenQA.Selenium.Appium;
using OpenQA.Selenium.Appium.iOS;
using OpenQA.Selenium.Appium.Service;
using OpenQA.Selenium.Remote;
using AutomationFrameWork.Driver.Interface;
using OpenQA.Selenium.Appium.Enums;

namespace AutomationFrameWork.Driver
{
    class iOS : IDrivers
    {
        public object Driver
        {
            get; set;
        }
        public object DesiredCapabilities
        {
            get
            {
                DesiredCapabilities capabilities = new DesiredCapabilities();
                capabilities.SetCapability("browserName", MobileBrowserType.Safari);
                capabilities.SetCapability("deviceName", "iOS");
                return capabilities;
            }
        }

        public object DriverServices
        {
            get
            {
                AppiumServiceBuilder serices = new AppiumServiceBuilder();
                serices.UsingAnyFreePort();
                serices.Build();
                return serices;
            }
        }

        public void StartDriver(DriverConfiguration configuration)
        {
            configuration.DriverServices = configuration.DriverServices ?? DriverServices;
            configuration.DesiredCapabilities = configuration.DesiredCapabilities ?? DesiredCapabilities;
            IOSDriver<AppiumWebElement> driver = new IOSDriver<AppiumWebElement>((AppiumServiceBuilder)configuration.DriverServices, (DesiredCapabilities)configuration.DesiredCapabilities, TimeSpan.FromSeconds(configuration.CommandTimeout));
            driver.Manage().Timeouts().SetPageLoadTimeout(TimeSpan.FromSeconds(configuration.PageLoadTimeout));
            driver.Manage().Timeouts().SetScriptTimeout(TimeSpan.FromSeconds(configuration.ScriptTimeout));
            Driver = driver;
        }
    }
}
