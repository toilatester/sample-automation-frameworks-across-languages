using AutomationFrameWork.Driver.Interface;
using OpenQA.Selenium.Appium;
using OpenQA.Selenium.Appium.Android;
using OpenQA.Selenium.Appium.Enums;
using OpenQA.Selenium.Appium.Service;
using OpenQA.Selenium.Remote;
using System;

namespace AutomationFrameWork.Driver
{
    class Android : IDrivers
    {
        public object Driver
        {
            get; set;
        }
        public object DesiredCapabilities
        {
            get
            {
                DesiredCapabilities capabilities = OpenQA.Selenium.Remote.DesiredCapabilities.Android();
                capabilities.SetCapability("browserName", MobileBrowserType.Chrome);
                capabilities.SetCapability("deviceName", "Android");
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
            AndroidDriver<AppiumWebElement> driver = new AndroidDriver<AppiumWebElement>((AppiumServiceBuilder)configuration.DriverServices, (DesiredCapabilities)configuration.DesiredCapabilities, TimeSpan.FromSeconds(configuration.CommandTimeout));
            driver.Manage().Timeouts().SetPageLoadTimeout(TimeSpan.FromSeconds(configuration.PageLoadTimeout));
            driver.Manage().Timeouts().SetScriptTimeout(TimeSpan.FromSeconds(configuration.ScriptTimeout));
            Driver = driver;
        }
    }
}
