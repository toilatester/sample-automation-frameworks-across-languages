using System;
using AutomationFrameWork.Reporter.ReportItems;
using System.Reflection;
using System.IO;
using AutomationFrameWork.Reporter.ReportUtils;
namespace AutomationFrameWork.Reporter.ReportHelpers
{
    public static class ReportHelper
    {
        public static ReportConfiguration Configuration;

        private static string GetPath ()
        {
            var codeBase = Assembly.GetExecutingAssembly().CodeBase;
            var uri = new UriBuilder(codeBase);
            var path = Path.GetDirectoryName(Uri.UnescapeDataString(uri.Path));
            return path;
        }

        static ReportHelper ()
        {
            try
            {
                var path = GetPath();
                Directory.SetCurrentDirectory(path);
                var configuration = ReportConfigurationHelper.Load(@"ReportConfig.xml");
                //var configuration = NunitGoConfigurationHelper.Load(Path.Combine(path, "NUnitGoConfig.xml"));
                Configuration = configuration;
            }
            catch (Exception ex)
            {
                InternalLogs.Exception(ex, GetPath(), "Exception in ReportHelper constructor");
            }
        }
    }
}
