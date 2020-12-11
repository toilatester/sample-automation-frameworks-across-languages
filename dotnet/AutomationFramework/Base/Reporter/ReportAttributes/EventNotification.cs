using System;
using System.Collections.Generic;
using System.Linq;
using AutomationFrameWork.Reporter.Notifications;

namespace AutomationFrameWork.Reporter.ReportAttributes
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class | AttributeTargets.Assembly, AllowMultiple = true)]
    public class EventNotification : Attribute
    {
        public EventNotification (string eventName,
            double maxDifference,
            params string[] emails)
        {
            EventName = eventName;
            MaxDifference = maxDifference;
            var emailsList = emails.ToList();
            Targets = new List<EmailInformations>();
            foreach (var email in emailsList)
            {
                Targets.Add(new EmailInformations { Email = email });
            }
        }

        public string Name
        {
            get; set;
        }
        public string EventName
        {
            get; private set;
        }
        public double MaxDifference
        {
            get; private set;
        }
        public string FullPath
        {
            get; set;
        }
        public List<EmailInformations> Targets
        {
            get; private set;
        }
    }
}
