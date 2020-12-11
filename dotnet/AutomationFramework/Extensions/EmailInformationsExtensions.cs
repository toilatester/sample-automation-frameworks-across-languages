using System.Net.Mail;


namespace AutomationFrameWork.Reporter.Notifications
  {
    internal static class EmailInformationsExtensions
    {
        public static MailAddress ToMailAddress (this EmailInformations address)
        {
            return new MailAddress(address.Email, address.Name);
        }
    }
}
