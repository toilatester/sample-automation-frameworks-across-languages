using System;
using NUnit.Framework;
using NUnit.Framework.Interfaces;
using System.IO;
using System.Reflection;
using System.Collections.Generic;
using System.Linq;
using AutomationFrameWork.Reporter.ReportItems;
using AutomationFrameWork.Reporter.ReportUtils;
using AutomationFrameWork.Reporter.ReportHelpers;
using AutomationFrameWork.Reporter.Main;
using AutomationFrameWork.Base.Reporter.ReportUtils;
using AutomationFrameWork.Reporter.Remarks;
using AutomationFrameWork.Reporter.Screenshots;
using AutomationFrameWork.Reporter.ReportElements.TestReportHtml;
using AutomationFrameWork.Reporter.ReportElements.ReportElementsCore;
using AutomationFrameWork.Reporter.Notifications;
using AutomationFrameWork.Reporter.ReportElements.ReportSections;
using AutomationFrameWork.Reporter.TestEvents;
namespace AutomationFrameWork.Reporter.ReportAttributes
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class | AttributeTargets.Assembly, AllowMultiple = false)]
    public class HTML : Attribute, ITestAction
    {
        private static readonly object _syncRoot = new Object();
        private Guid _guid;
        private string _testName;
        private readonly string _projectName;
        private readonly string _className;
        private static ReportConfiguration _configuration;
        private static string _outputPath;
        private static string _screenshotsPath;
        private static string _attachmentsPath;

        private MethodInfo _methodInfo;
        private TestInformations _test;
        private static DateTime _startSuite;
        private DateTime _start = default(DateTime);
        private DateTime _finish = default(DateTime);
        private string _testOutput;

        public HTML (string testGuidString = "", string projectName = "", string className = "",
            string testName = "")
        {
            _guid = testGuidString.Equals("")
                ? Guid.Empty
                : new Guid(testGuidString);
            _projectName = projectName;
            _className = className;
            _testName = testName;
            _configuration = ReportHelper.Configuration;
            _outputPath = _configuration.LocalOutputPath;
            _screenshotsPath = Output.GetScreenshotsPath(_outputPath);
            _attachmentsPath = Output.GetAttachmentsPath(_outputPath);
            if (_startSuite.Date == default(DateTime))
            {
                _startSuite = DateTime.Now;
            }
        }

        public void BeforeTest (ITest test)
        {
            lock (_syncRoot)
            {
                CreateDirectories();
                Report.SetUp();
                _start = DateTime.Now;
                _methodInfo = test.Method.MethodInfo;
                if (!IsExistResources(_outputPath))
                {
                    var primerName = Output.Files.PrimerStyleFile;
                    ExtractResource(primerName, _outputPath);

                    var octiconsName = Output.Files.OcticonsStyleFiles;
                    ExtractResources(octiconsName, _outputPath);

                    //jquery - 1.11.0.min.js
                    var jqueryName = Output.Files.JQueryScriptFile;
                    ExtractResource(jqueryName, _outputPath);
                }
            }
        }

        public void AfterTest (ITest test)
        {
            lock (_syncRoot)
            {
                _finish = DateTime.Now;
                _guid = _guid.Equals(Guid.Empty)
                    ? (Report.TestGuid.Equals(Guid.Empty) ? GuidConverter.ToMd5HashGuid(test.FullName) : Report.TestGuid)
                    : _guid;
                _testOutput = TestContext.Out.ToString();
                _testName = _testName.Equals("") ? Report.TestName : _testName;

                var context = TestContext.CurrentContext;
                var relativeTestHref = "Attachments" + @"/" + _guid + @"/" + Output.Files.GetTestHtmlName(_finish);

                _test = new TestInformations
                {
                    DateTimeStart = _start,
                    DateTimeFinish = _finish,
                    TestDuration = (_finish - _start).TotalSeconds,
                    FullName = test.FullName,
                    ProjectName = _projectName.Equals("") ? test.FullName.Split('.').First() : _projectName,
                    ClassName = _className.Equals("") ? test.FullName.Split('.').Skip(1).First() : _className,
                    Name = _testName.Equals("") ? test.Name : _testName,
                    TestStackTrace = context.Result.StackTrace ?? "",
                    TestMessage = context.Result.Message ?? "",
                    Result = context.Result.Outcome?.ToString() ?? "Unknown",
                    Guid = _guid,
                    HasOutput = !_testOutput.Equals(string.Empty),
                    AttachmentsPath = _attachmentsPath + _guid + @"\",
                    TestHrefRelative = relativeTestHref,
                    TestHrefAbsolute = _configuration.ServerLink + relativeTestHref,
                    Events = Report.GetEvents()
                };

                TakeScreenshotIfFailed();
                AddScreenshots();
                CleanUpTestFiles();
                SaveTestFiles();
                SendEmails(_test.IsSuccess());
                SendEmailsForEvents();
                GenerateReport();
                Flush();
            }
        }

        public ActionTargets Targets => ActionTargets.Test;

        private List<Remark> GetTestRemarks ()
        {
            var remarks = new List<Remark>();
            try
            {
                var rmrks = _methodInfo.GetCustomAttributes<TestRemark>();
                remarks.AddRange(rmrks.Select(
                    remarkAttribute => new Remark(remarkAttribute.RemarkDate, remarkAttribute.RemarkMessage)));
            }
            catch (Exception ex)
            {
                InternalLogs.Exception(ex, "Exception in GetTestRemarks");
            }
            return remarks;
        }

        private void SaveTestFiles ()
        {
            try
            {
                Directory.CreateDirectory(_test.AttachmentsPath);
                _test.SaveAsXml(_test.AttachmentsPath + Output.Files.GetTestXmlName(_test.DateTimeFinish));
                var testVersions = ReportTestHelper.GetTestsFromFolder(_test.AttachmentsPath);
                var testRemarks = GetTestRemarks();
                var chartId = Output.GetHistoryChartId(_test.Guid, _test.DateTimeFinish);
                var highstockHistory = new ReportJsHighstock(testVersions, testRemarks, chartId);
                highstockHistory.SaveScript(_test.AttachmentsPath);

                var testPath = _test.AttachmentsPath + Output.Files.GetTestHtmlName(_test.DateTimeFinish);
                _test.GenerateTestPage(testPath, _testOutput, Output.Files.GetTestHistoryScriptName(_test.DateTimeFinish));
            }
            catch (Exception ex)
            {
                InternalLogs.Exception(ex, "Exception in SaveTestFiles");
            }
        }

        private void CleanUpTestFiles ()
        {
            try
            {
                var maxDate = DateTime.Now.AddDays(-_configuration.TestHistoryDaysLength);
                var folders = Directory.GetDirectories(_attachmentsPath);
                foreach (var folder in folders)
                {
                    var dirInfo = new DirectoryInfo(folder);
                    var allFiles = dirInfo.GetFiles("*.xml").OrderByDescending(x => x.CreationTime);
                    if (dirInfo.LastWriteTime < maxDate || dirInfo.CreationTime < maxDate || !allFiles.Any())
                    {
                        Directory.Delete(dirInfo.FullName, true);
                    }
                    else
                    {
                        var folderTestVersions = ReportTestHelper.GetTestsFromFolder(folder);
                        var folderTestVersionsNumber = folderTestVersions.Count;
                        if (folderTestVersionsNumber >= _configuration.MaxTestVersionsNumber)
                        {
                            folderTestVersions.OrderByDescending(x => x.DateTimeFinish)
                                .Skip(_configuration.MaxTestVersionsNumber)
                                .ToList()
                                .ForEach(x => x.DeleteTestFiles(_screenshotsPath));
                        }
                        ReportTestHelper
                            .GetTestsFromFolder(folder)
                            .Where(x => x.DateTimeFinish < maxDate)
                            .ToList()
                            .ForEach(x => x.DeleteTestFiles(_screenshotsPath));
                    }
                }
            }
            catch (Exception ex)
            {
                InternalLogs.Exception(ex, "Exception in CleanUpTestFiles");
            }
        }

        private void SendEmails (bool isSuccess)
        {
            try
            {
                if (!_configuration.SendEmails) return;

                var subs = _methodInfo.GetCustomAttributes<Notification>();
                foreach (var sub in subs)
                {
                    var sendCondition = (sub.UnsuccessfulOnly && !isSuccess) || (!sub.UnsuccessfulOnly);
                    if (!sendCondition) continue;

                    var subscription = _configuration.Subsciptions.FirstOrDefault(x => x.Name.Equals(sub.Name));
                    if (subscription != null)
                    {
                        ReportEmailHelper.Send(_configuration.SendFromList, subscription.TargetEmails,
                            _test, _screenshotsPath, _configuration.AddLinksInsideEmail);
                    }
                    else if (sub.FullPath != null)
                    {
                        subscription = ReportXMLHelper.Load<Subsciption>(sub.FullPath);
                        ReportEmailHelper.Send(_configuration.SendFromList, subscription.TargetEmails,
                            _test, _screenshotsPath, _configuration.AddLinksInsideEmail);
                    }
                    else if (sub.Targets.Any())
                    {
                        ReportEmailHelper.Send(_configuration.SendFromList, sub.Targets,
                            _test, _screenshotsPath, _configuration.AddLinksInsideEmail);
                    }
                }
                /*
                var singleSubs = _methodInfo.GetCustomAttributes<SingleTestSubscriptionAttribute>();
                foreach (var singleSub in singleSubs)
                {
                    var sendCondition = (singleSub.UnsuccessfulOnly && !isSuccess) || (!singleSub.UnsuccessfulOnly);
                    if (!sendCondition) continue;

                    var singleTestSubscription =
                        _configuration.SingleTestSubscriptions.FirstOrDefault(x => x.TestGuid.Equals(_test.Guid));
                    if (singleTestSubscription != null)
                    {
                        ReportEmailHelper.Send(_configuration.SendFromList, singleTestSubscription.TargetEmails,
                            _test, _screenshotsPath, _configuration.AddLinksInsideEmail);
                    }
                    else if (singleSub.FullPath != null)
                    {
                        var singleSubFromXml = ReportXMLHelper.Load<SingleTestSubscription>(singleSub.FullPath);
                        ReportEmailHelper.Send(_configuration.SendFromList, singleSubFromXml.TargetEmails,
                            _test, _screenshotsPath, _configuration.AddLinksInsideEmail);
                    }
                    else if (singleSub.Targets.Any())
                    {
                        ReportEmailHelper.Send(_configuration.SendFromList, singleSub.Targets,
                            _test, _screenshotsPath, _configuration.AddLinksInsideEmail);
                    }
                }
                */
                var eventSubs = _methodInfo.GetCustomAttributes<EventNotification>();
                foreach (var sub in eventSubs)
                {
                    var currentTestVersions = ReportTestHelper.GetTestsFromFolder(_test.AttachmentsPath);

                    if (currentTestVersions.Count <= 1) continue;

                    var previousTest = currentTestVersions
                        .OrderByDescending(x => x.DateTimeFinish)
                        .Skip(1)
                        .First(x => x.Events.Any(e => e.Name.Equals(sub.EventName)));
                    var previuosEvent = previousTest.Events.First(x => x.Name.Equals(sub.EventName));
                    var currentEvent = _test.Events.First(x => x.Name.Equals(sub.EventName));

                    if (Math.Abs(currentEvent.Duration - previuosEvent.Duration) > sub.MaxDifference)
                    {
                        var subscription = _configuration.EventDurationSubscriptions.FirstOrDefault(x => x.Name.Equals(sub.Name));
                        if (subscription != null)
                        {
                            ReportEmailHelper.Send(_configuration.SendFromList, subscription.TargetEmails,
                                _test, _screenshotsPath, _configuration.AddLinksInsideEmail,
                                true, sub.EventName, previuosEvent);
                        }
                        else if (sub.FullPath != null)
                        {
                            subscription = ReportXMLHelper.Load<EventDurationSubscription>(sub.FullPath);
                            ReportEmailHelper.Send(_configuration.SendFromList, subscription.TargetEmails,
                                _test, _screenshotsPath, _configuration.AddLinksInsideEmail,
                                true, sub.EventName, previuosEvent);
                        }
                        else if (sub.Targets.Any())
                        {
                            ReportEmailHelper.Send(_configuration.SendFromList, sub.Targets,
                                _test, _screenshotsPath, _configuration.AddLinksInsideEmail,
                                true, sub.EventName, previuosEvent);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                InternalLogs.Exception(ex, "Exception in SendEmail");
            }

        }

        private void SendEmailsForEvents ()
        {
            try
            {
                if (!_configuration.SendEmails) return;

                var eventSubs = _methodInfo.GetCustomAttributes<EventNotification>();
                foreach (var sub in eventSubs)
                {
                    var currentTestVersions = ReportTestHelper.GetTestsFromFolder(_test.AttachmentsPath);
                    var subscription = _configuration.EventDurationSubscriptions.FirstOrDefault(x => x.Name.Equals(sub.Name));
                    if (currentTestVersions.Count > 1)
                    {
                        var previousTest = currentTestVersions
                            .OrderByDescending(x => x.DateTimeFinish)
                            .Skip(1)
                            .First(x => x.Events.Any(e => e.Name.Equals(sub.EventName)));
                        var previuosEvent = previousTest.Events.First(x => x.Name.Equals(sub.EventName));
                        var currentEvent = _test.Events.First(x => x.Name.Equals(sub.EventName));

                        if (currentEvent.Duration - previuosEvent.Duration > sub.MaxDifference)
                        {
                            if (subscription != null)
                            {
                                ReportEmailHelper.Send(_configuration.SendFromList, subscription.TargetEmails,
                                    _test, _screenshotsPath, _configuration.AddLinksInsideEmail,
                                    true, sub.EventName, previuosEvent);
                            }
                            else if (sub.FullPath != null)
                            {
                                subscription = ReportXMLHelper.Load<EventDurationSubscription>(sub.FullPath);
                                ReportEmailHelper.Send(_configuration.SendFromList, subscription.TargetEmails,
                                    _test, _screenshotsPath, _configuration.AddLinksInsideEmail,
                                    true, sub.EventName, previuosEvent);
                            }
                            else if (sub.Targets.Any())
                            {
                                ReportEmailHelper.Send(_configuration.SendFromList, sub.Targets,
                                    _test, _screenshotsPath, _configuration.AddLinksInsideEmail,
                                    true, sub.EventName, previuosEvent);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                InternalLogs.Exception(ex, "Exception in SendEmailsForEvents");
            }

        }

        private void ExtractResource (string embeddedFileName, string destinationPath)
        {

            var currentAssembly = GetType().Assembly;
            var arrResources = GetType().Assembly.GetManifestResourceNames();
            var destinationFullPath = Path.Combine(destinationPath, embeddedFileName);
            if (!File.Exists(destinationFullPath) && !File.Exists(destinationPath + "\\" + embeddedFileName))
            {
                foreach (var resourceName in arrResources
                    .Where(resourceName => resourceName.ToUpper().EndsWith(embeddedFileName.ToUpper())))
                {
                    using (var resourceToSave = currentAssembly.GetManifestResourceStream(resourceName))
                    {
                        using (var output = File.Create(destinationFullPath))
                        {
                            resourceToSave?.CopyTo(output);
                        }
                        resourceToSave?.Close();
                    }
                }
            }
        }

        private void ExtractResources (IEnumerable<string> embeddedFileNames, string destinationPath)
        {
            foreach (var embeddedFileName in embeddedFileNames)
            {
                if (!File.Exists(destinationPath + "\\" + embeddedFileName))
                    ExtractResource(embeddedFileName, destinationPath);
            }
        }

        public void GenerateReport ()
        {
            try
            {
                if (!_configuration.GenerateReport) return;

                const string cssPageName = Output.Files.ReportStyleFile;
                var cssFullPath = Path.Combine(_outputPath, cssPageName);
                if (!File.Exists(cssFullPath))
                {
                    PageGenerator.GenerateStyleFile(cssFullPath);
                }
                /*
                var primerName = Output.Files.PrimerStyleFile;
                ExtractResource(primerName, _outputPath);

                var octiconsName = Output.Files.OcticonsStyleFiles;
                ExtractResources(octiconsName, _outputPath);

                //jquery - 1.11.0.min.js
                var jqueryName = Output.Files.JQueryScriptFile;
                ExtractResource(jqueryName, _outputPath);
                */
                var tests = ReportTestHelper.GetNewestTests(_attachmentsPath).OrderBy(x => x.DateTimeFinish).ToList();
                var stats = new MainStatistics(tests, _startSuite);
                var statsChart = new MainInfoChart(stats, Output.GetStatsPieId());
                statsChart.SaveScript(_outputPath);
                tests.GenerateTimelinePage(Path.Combine(_outputPath, Output.Files.TimelineFile));
                stats.GenerateMainStatisticsPage(Path.Combine(_outputPath, Output.Files.TestStatisticsFile));
                tests.GenerateTestListPage(Path.Combine(_outputPath, Output.Files.TestListFile));
                tests.GenerateReportMainPage(_outputPath, stats);

            }
            catch (Exception ex)
            {
                InternalLogs.Exception(ex, "Exception in GenerateReport");
            }
        }

        private void TakeScreenshotIfFailed ()
        {
            try
            {
                if (!_test.IsSuccess() && _configuration.TakeScreenshotAfterTestFailed)
                {
                    var now = DateTime.Now;
                    _test.Screenshots.Add(new Screenshot(now));
                    ScreenshotTaker.TakeScreenshot(_screenshotsPath, now);
                }
            }
            catch (Exception ex)
            {
                InternalLogs.Exception(ex, "Exception in TakeScreenshot");
            }
        }

        private void AddScreenshots ()
        {
            _test.Screenshots.AddRange(Report.GetScreenshots());
        }

        private static void CreateDirectories ()
        {
            Directory.CreateDirectory(_outputPath);
            Directory.CreateDirectory(_screenshotsPath);
            Directory.CreateDirectory(_attachmentsPath);
        }

        private void Flush ()
        {
            _guid = Guid.Empty;
            _test = new TestInformations();
            Report.TearDown();
        }
        private Boolean IsExistResources (string destinationPath)
        {
            Boolean _isExist = true;
            var primerName = Output.Files.PrimerStyleFile;
            var octiconsName = Output.Files.OcticonsStyleFiles;
            var jqueryName = Output.Files.JQueryScriptFile;
            foreach (var embeddedFileName in octiconsName)
            {
                _isExist = _isExist && (File.Exists(destinationPath + "\\" + embeddedFileName));

            }
            _isExist = _isExist && (File.Exists(destinationPath + "\\" + primerName)) && (File.Exists(destinationPath + "\\" + jqueryName));
            return _isExist;
        }
    }
}
