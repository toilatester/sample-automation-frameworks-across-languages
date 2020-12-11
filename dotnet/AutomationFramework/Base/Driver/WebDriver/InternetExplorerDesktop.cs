using AutomationFrameWork.Driver.Interface;
using System;
using OpenQA.Selenium.IE;
using OpenQA.Selenium;

namespace AutomationFrameWork.Driver
{
    class InternetExplorerDesktop : IDrivers
    {
        public InternetExplorerDesktop() { }
        public object Driver
        {
            get; set;
        }
        public object DesiredCapabilities
        {
            get
            {
                InternetExplorerOptions options = new InternetExplorerOptions();
                options.ElementScrollBehavior = InternetExplorerElementScrollBehavior.Top;
                options.EnableNativeEvents = true;
                options.EnsureCleanSession = true;
                options.IgnoreZoomLevel = true;
                options.IntroduceInstabilityByIgnoringProtectedModeSettings = true;
                options.RequireWindowFocus = false;
                options.EnablePersistentHover = false;
                options.PageLoadStrategy = InternetExplorerPageLoadStrategy.Eager;
                options.UnexpectedAlertBehavior = InternetExplorerUnexpectedAlertBehavior.Ignore;
                return options;
            }
        }

        public object DriverServices
        {
            get
            {
                InternetExplorerDriverService serivces = InternetExplorerDriverService.CreateDefaultService();
                serivces.HideCommandPromptWindow = true;
                serivces.Implementation = InternetExplorerDriverEngine.AutoDetect;
                serivces.SuppressInitialDiagnosticInformation = false;
                return serivces;
            }
        }

        public void StartDriver(DriverConfiguration configuration)
        {
            configuration.DriverServices = configuration.DriverServices ?? DriverServices;
            configuration.DesiredCapabilities = configuration.DesiredCapabilities ?? DesiredCapabilities;
            IWebDriver driver = new InternetExplorerDriver((InternetExplorerDriverService)configuration.DriverServices, (InternetExplorerOptions)configuration.DesiredCapabilities, TimeSpan.FromSeconds(configuration.CommandTimeout));
            driver.Manage().Timeouts().SetPageLoadTimeout(TimeSpan.FromSeconds(configuration.PageLoadTimeout));
            driver.Manage().Timeouts().SetScriptTimeout(TimeSpan.FromSeconds(configuration.ScriptTimeout));
            if (configuration.MaximizeBrowser)
                driver.Manage().Window.Maximize();
            Driver = driver;
        }
    }
}
