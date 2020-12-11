using System;
using System.Collections.Generic;
using AutomationFrameWork.Reporter.TestEvents;
using AutomationFrameWork.Reporter.Screenshots;
using AutomationFrameWork.Reporter.ReportUtils;
namespace AutomationFrameWork.Reporter.ReportItems
{
    public class TestInformations
    {
        public string Name;
        public string FullName;
        public string ClassName;
        public string ProjectName;
        public double TestDuration;
        public DateTime DateTimeStart;
        public DateTime DateTimeFinish;
        public string TestStackTrace;
        public string TestMessage;
        public string Result;
        public Guid Guid;
        public string AttachmentsPath;
        public string TestHrefRelative;
        public string TestHrefAbsolute;
        public string LogHref;
        public bool HasOutput;
        public List<Screenshot> Screenshots;
        public List<TestEvent> Events;

        public TestInformations ()
        {
            Name = string.Empty;
            FullName = string.Empty;
            ClassName = string.Empty;
            ProjectName = string.Empty;
            TestDuration = 0.0;
            DateTimeStart = new DateTime();
            DateTimeFinish = new DateTime();
            TestStackTrace = string.Empty;
            TestMessage = string.Empty;
            Result = "Unknown";
            Guid = Guid.NewGuid();
            TestHrefRelative = string.Empty;
            TestHrefAbsolute = string.Empty;
            LogHref = string.Empty;
            AttachmentsPath = string.Empty;
            HasOutput = false;
            Screenshots = new List<Screenshot>();
            Events = new List<TestEvent>();
        }

        public bool IsSuccess ()
        {
            return Result.Equals("Success") || Result.Equals("Passed");
        }

        public bool IsFailed ()
        {
            return Result.Equals("Failure") || Result.Equals("Failed");
        }

        public bool IsBroken ()
        {
            return Result.Equals("Failed:Error") || Result.Equals("Error");
        }

        public bool IsIgnored ()
        {
            return Result.Equals("Ignored") || Result.Equals("Skipped:Ignored");
        }

        public bool IsInconclusive ()
        {
            return Result.Equals("Inconclusive");
        }

        public string GetColor ()
        {
            switch (Result)
            {
                case "Ignored":
                    return ReportColors.TestIgnored;
                case "Skipped:Ignored":
                    return ReportColors.TestIgnored;

                case "Passed":
                    return ReportColors.TestPassed;
                case "Success":
                    return ReportColors.TestPassed;

                case "Failed:Error":
                    return ReportColors.TestBroken;
                case "Error":
                    return ReportColors.TestBroken;

                case "Inconclusive":
                    return ReportColors.TestInconclusive;

                case "Failure":
                    return ReportColors.TestFailed;
                case "Failed":
                    return ReportColors.TestFailed;

                default:
                    return ReportColors.TestUnknown;
            }
        }
    }
}
