namespace AutomationFrameWork.Driver.Interface
{
    public interface IDrivers
    {
        void StartDriver(DriverConfiguration configuration);
        object Driver { get; set; }
        object DriverServices { get; }
        object DesiredCapabilities { get; }
    }    
}
