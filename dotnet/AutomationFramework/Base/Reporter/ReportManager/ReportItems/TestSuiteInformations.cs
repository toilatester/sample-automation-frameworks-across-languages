using System.Collections.Generic;

namespace AutomationFrameWork.Reporter.ReportItems
{
    public class TestSuiteInformations
    {
        public string Name;
        public List<TestInformations> Tests;
        public List<TestSuiteInformations> Suites;

        public TestSuiteInformations (string name)
        {
            Name = name;
            Tests = new List<TestInformations>();
            Suites = new List<TestSuiteInformations>();
        }
    }
}
