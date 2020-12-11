using System;
namespace AutomationFrameWork.Driver
{
    public class DriverConfiguration
    {
        public object DriverServices { get; set; } = null;
        public object DesiredCapabilities { get; set; } = null;
        public int CommandTimeout { get; set; } = 60;
        public int PageLoadTimeout { get; set; } = 60;
        public int ScriptTimeout { get; set; } = 60;
        public bool MaximizeBrowser { get; set; } = false;
        public Uri RemoteUri { get; set; }
    }
}
