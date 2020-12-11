using System;
using System.Collections.Generic;
using AutomationFrameWork.Reporter.Notifications;
using AutomationFrameWork.Reporter.TestEvents;

namespace AutomationFrameWork.Reporter.ReportItems
{
    public class ReportConfiguration
    {
        public string LocalOutputPath;
        public bool TakeScreenshotAfterTestFailed;
        public bool GenerateReport;
        public bool SendEmails;
        public bool AddLinksInsideEmail;
        public string ServerLink;
        public List<Subsciption> Subsciptions;
        public List<SingleTestSubscription> SingleTestSubscriptions;
        public List<EventDurationSubscription> EventDurationSubscriptions;
        public string SmtpHost;
        public int SmtpPort;
        public bool EnableSsl;
        public List<EmailInformations> SendFromList;
        public int TestHistoryDaysLength;
        public int MaxTestVersionsNumber;
    }
}
