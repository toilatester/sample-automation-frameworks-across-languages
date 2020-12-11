using AutomationFrameWork.Driver.Interface;
using OpenQA.Selenium.Chrome;
using System;
using OpenQA.Selenium;
namespace AutomationFrameWork.Driver
{
    class iPhone4 : IDrivers
    {

        public iPhone4() { }
        public object Driver { get; set; }
        public object DesiredCapabilities
        {
            get
            {
                ChromeOptions options = new ChromeOptions();
                options.LeaveBrowserRunning = true;
                options.EnableMobileEmulation("Apple iPhone 4");
                return options;
            }
        }
        public object DriverServices
        {
            get
            {
                ChromeDriverService serivces = ChromeDriverService.CreateDefaultService();
                serivces.EnableVerboseLogging = false;
                serivces.HideCommandPromptWindow = true;
                serivces.SuppressInitialDiagnosticInformation = false;
                return serivces;
            }
        }       
        public void StartDriver(DriverConfiguration configuration)
        {
            configuration.DriverServices = configuration.DriverServices ?? DriverServices;
            configuration.DesiredCapabilities = configuration.DesiredCapabilities ?? DesiredCapabilities;
            var options = (ChromeOptions)configuration.DesiredCapabilities;
            options.EnableMobileEmulation("Apple iPhone 4");
            IWebDriver driver = new ChromeDriver((ChromeDriverService)configuration.DriverServices, options, TimeSpan.FromSeconds(configuration.CommandTimeout));
            driver.Manage().Timeouts().SetPageLoadTimeout(TimeSpan.FromSeconds(configuration.PageLoadTimeout));
            driver.Manage().Timeouts().SetScriptTimeout(TimeSpan.FromSeconds(configuration.ScriptTimeout));
            if (configuration.MaximizeBrowser)
                driver.Manage().Window.Maximize();
            Driver = driver;
        }
    }
}
