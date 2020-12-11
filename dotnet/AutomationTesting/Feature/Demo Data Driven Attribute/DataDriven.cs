using NUnit.Framework;
using AutomationFrameWork.Helper;

namespace AutomationTesting.DemoDataDriven
{
    class DataDriven
    {
        [Test,Category("Demo Data Driven")]
        [TestCaseSource(typeof(DataHelper), "DataDrivenExcel", new object[] { "D:\\Workspace\\Git\\AutomationFramework\\TestData\\DemoTestData.xlsx", "Demo", true })]
        public void DemoDataDriven(string lName,string fName,string birth,string place)
        {
            System.Console.WriteLine($"This demo data driven attribute last name={lName} first name={fName} and birthday={birth} and place={place}");
        }
    }
}
