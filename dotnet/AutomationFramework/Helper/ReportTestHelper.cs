using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AutomationFrameWork.Reporter.ReportItems;
using AutomationFrameWork.Reporter.ReportUtils;
namespace AutomationFrameWork.Reporter.ReportHelpers
{
    public static class ReportTestHelper
    {
        public static void SaveAsXml (this  TestInformations test, string fullPath)
        {
            test.Save(fullPath);
        }     
        public static void DeleteTestFiles (this TestInformations test, string screenshotsPath)
        {           
            try
            {
                var finishDate = test.DateTimeFinish;
                var scriptPath = Path.Combine(test.AttachmentsPath, Output.Files.GetTestHistoryScriptName(finishDate));
                var htmlPath = Path.Combine(test.AttachmentsPath, Output.Files.GetTestHtmlName(finishDate));
                var xmlPath = Path.Combine(test.AttachmentsPath, Output.Files.GetTestXmlName(finishDate));
                File.Delete(scriptPath);
                File.Delete(htmlPath);
                File.Delete(xmlPath);
                foreach (var screenshot in test.Screenshots)
                {
                    File.Delete(Path.Combine(screenshotsPath, screenshot.Name));
                }
            }
            catch (Exception ex)
            {
                InternalLogs.Exception(ex, "Exception in CleanUpTestFiles");
            }
        }

        private static TestInformations Load (string fullPath)
        {
            return ReportXMLHelper.Load<TestInformations>(fullPath, "Excteption while loading TestReport, Path = " + fullPath);
        }

        public static List<TestInformations> GetTestsFromFolder (string folder)
        {
            var tests = new List<TestInformations>();
            try
            {
                var dirInfo = new DirectoryInfo(folder);
                var files = dirInfo.GetFiles("*.xml", SearchOption.AllDirectories);
                tests.AddRange(files.Select(fileInfo => Load(fileInfo.FullName)));
            }
            catch (Exception ex)
            {
                InternalLogs.Exception(ex, "Exception while loading test xml file");
            }
            return tests;
        }

        public static List<TestInformations> GetNewestTests (string attachmentsPath)
        {
            var tests = new List<TestInformations>();
            var folders = Directory.GetDirectories(attachmentsPath);

            foreach (var folder in folders)
            {
                try
                {
                    var dirInfo = new DirectoryInfo(folder);
                    var allFiles = dirInfo.GetFiles("*.xml").OrderByDescending(x => x.CreationTime);
                    if (allFiles.Any())
                    {
                        var newestFile = allFiles.First().FullName;
                        tests.Add(Load(newestFile));
                    }
                    else
                    {
                        Directory.Delete(dirInfo.FullName);
                    }
                }
                catch (Exception ex)
                {
                    InternalLogs.Exception(ex, "Exception while loading test xml file");
                }
            }

            return tests;
        }

        public static DateTime GetStartDate (this List<TestInformations> tests)
        {            
            return tests.OrderBy(x => x.DateTimeStart).First().DateTimeStart;
        }

        public static DateTime GetFinishDate (this List<TestInformations> tests)
        {
            return tests.OrderBy(x => x.DateTimeFinish).Last().DateTimeFinish;
        }

        public static TimeSpan Duration (this List<TestInformations> tests,DateTime startDate)
        {
            return (GetFinishDate(tests) - startDate);
            //return (GetFinishDate(tests) - GetStartDate(tests));
        }
    }
}
