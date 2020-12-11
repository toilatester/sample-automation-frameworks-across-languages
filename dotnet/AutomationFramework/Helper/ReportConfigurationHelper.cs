using AutomationFrameWork.Reporter.ReportItems;

namespace AutomationFrameWork.Reporter.ReportHelpers
{
    internal static class ReportConfigurationHelper
    {
        public static void Save (this ReportConfiguration configuration, string fullPath)
        {
            ReportXMLHelper.Save(configuration, fullPath);
        }

        public static ReportConfiguration Load (string fullPath)
        {
            //ReportXMLHelper.Load<NunitGoConfiguration>
            //return null;
            return ReportXMLHelper.Load<ReportConfiguration>(fullPath);
        }
    }
}
