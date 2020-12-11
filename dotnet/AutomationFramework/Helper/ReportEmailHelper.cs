using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using AutomationFrameWork.Reporter.ReportItems;
using AutomationFrameWork.Reporter.TestEvents;
using AutomationFrameWork.Reporter.ReportUtils;
using AutomationFrameWork.Reporter.ReportHelpers;

namespace AutomationFrameWork.Reporter.Notifications
{
    internal static class ReportEmailHelper
    {
        private static bool SingleSend (EmailInformations from, EmailInformations to, MailMessage message)
        {
            try
            {
                var fromAddress = new MailAddress(from.Email, from.Name);
                var toAddress = new MailAddress(to.Email, to.Name);
                var config = ReportHelper.Configuration;
                var smtp = new SmtpClient
                {
                    Host = config.SmtpHost,
                    Port = config.SmtpPort,
                    EnableSsl = config.EnableSsl,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(from.Email.Split('@').First(), from.Password),
                    Timeout = 10000
                };

                using (smtp)
                {
                    message.From = fromAddress;
                    message.To.Add(toAddress);
                    smtp.Send(message);

                }
            }
            catch (Exception ex)
            {
                InternalLogs.Exception(ex, "Failure in SingleSend method!");
                return false;
            }
            return true;
        }

        public static void Send (List<EmailInformations> mailFromList, List<EmailInformations> targetEmails,
            TestInformations test, string screenshotsPath, bool addLinks,
            bool isEventEmail = false, string eventName = "", TestEvent previousRunEvent = null)
        {
            foreach (var address in targetEmails)
            {
                var fromMails = mailFromList;
                var success = false;
                while (!success && fromMails.Any())
                {
                    using (var message = new MailMessage
                    {
                        IsBodyHtml = true,
                        Subject = EmailGenerator.GetMailSubject(test, isEventEmail, eventName),
                        Body = EmailGenerator.GetMailBody(test, addLinks, isEventEmail, eventName, previousRunEvent)
                    })
                    {
                        var attachments = EmailGenerator.GetAttachmentsFromScreenshots(test, screenshotsPath);
                        message.AddAttachments(attachments);
                        success = SingleSend(fromMails.First(), address, message);
                        if (!success)
                        {
                            fromMails = fromMails.Skip(1).ToList();
                        }

                    }
                }
            }
        }
    }
}
