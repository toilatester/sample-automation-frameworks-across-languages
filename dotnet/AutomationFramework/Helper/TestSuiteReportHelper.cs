using System.Collections.Generic;
using System.Linq;
using AutomationFrameWork.Reporter.ReportItems;

namespace AutomationFrameWork.Reporter.ReportHelpers
{
    internal static class TestSuiteReportHelper
    {
        public static TestSuiteInformations GetSuite (this List<TestInformations> tests, string suiteName)
        {
            var suite = new TestSuiteInformations(suiteName);
            var projects = new HashSet<string>();
            foreach (var test in tests)
            {
                projects.Add(test.ProjectName);
            }

            foreach (var project in projects)
            {
                var projectName = project;
                var projectSuite = new TestSuiteInformations(projectName);
                var classes = new HashSet<string>();
                var projectTests = tests.Where(x => x.ProjectName.Equals(projectName)).ToList();
                foreach (var test in projectTests)
                {
                    classes.Add(test.ClassName);
                }

                foreach (var className in classes)
                {
                    var currentClassName = className;
                    var classSuite = new TestSuiteInformations(className);
                    var classTests = projectTests.Where(x => x.ClassName.Equals(currentClassName));

                    foreach (var test in classTests)
                    {
                        classSuite.Tests.Add(test);
                    }
                    projectSuite.Suites.Add(classSuite);
                }
                suite.Suites.Add(projectSuite);

            }

            return suite;
        }

        public static List<TestInformations> GetTests (this TestSuiteInformations mainSuite)
        {
            var tests = new List<TestInformations>();
            tests.AddRange(mainSuite.Tests);
            var suites = mainSuite.Suites;
            foreach (var suite in suites)
            {
                tests.AddRange(suite.Tests);
                var innerSuites = suite.Suites;
                foreach (var innerSuite in innerSuites)
                {
                    tests.AddRange(innerSuite.Tests);
                }
            }
            return tests;
        }

    }
}