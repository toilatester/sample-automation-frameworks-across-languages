using System;
using System.Collections.Generic;
using System.Linq;
using AutomationFrameWork.Reporter.Notifications;

namespace AutomationFrameWork.Reporter.ReportAttributes
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class | AttributeTargets.Assembly, AllowMultiple = true)]
    public class Notification : Attribute
    {
        public Notification (params string[] emails)
        {
            var emailsList = emails.ToList();
            Targets = new List<EmailInformations>();
            foreach (var email in emailsList)
            {
                Targets.Add(new EmailInformations { Email = email });
            }
        }

        public bool UnsuccessfulOnly = true;
        public string Name
        {
            get; set;
        }
        public string FullPath
        {
            get; set;
        }
        public List<EmailInformations> Targets
        {
            get;
        }
    }
}
