using System.Collections.Generic;
using System.Net.Mail;


namespace AutomationFrameWork.Reporter.Notifications
{
    internal static class EmailMessageExtensions
    {
        public static void AddAttachments (this MailMessage mail, List<Attachment> list)
        {
            foreach (var attachment in list)
            {
                mail.Attachments.Add(attachment);
            }
        }
    }
}
