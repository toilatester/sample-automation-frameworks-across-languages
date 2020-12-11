using System;
using System.Collections.Generic;

namespace AutomationFrameWork.Reporter.Notifications
{
    public class SingleTestSubscription
    {
        public Guid TestGuid;
        public List<EmailInformations> TargetEmails;
    }
}