using NUnit.Framework;
using AutomationFrameWork.Base;
using AutomationFrameWork.ActionsKeys;

namespace AutomationTesting.POM.HomePage
{
    class LoginValidate : BaseWebValidation<LoginElement>
    {
        public void ValidateLoginSucesfully (string expected)
        {
            WebKeywords.Instance.WaitTitleContains(expected, 15);
            string check = WebKeywords.Instance.GetTitle();
            Assert.IsTrue(check.Contains(expected), "Actual [" + check + "] is not match with expected [" + expected + "]");
        }
        public void ValidateUserNameErrorMsg (string expected)
        {
            WebKeywords.Instance.WaitElementVisible(Element.waitLblErrorUserMsg, 15);
            Assert.IsTrue(WebKeywords.Instance.GetAttribute(Element.lblErrorUserMsg, "innerHTML").Equals(expected), "Actual [" + WebKeywords.Instance.GetAttribute(Element.lblErrorUserMsg, "innerHTML") + "] is not match with expected [" + expected + "]");            
        }
        public void ValidatePassErrorMsg (string expected)
        {
            WebKeywords.Instance.WaitElementVisible(Element.waitLblErrorPassMsg, 15);
            Assert.IsTrue(WebKeywords.Instance.GetAttribute(Element.lblErrorPassMsg, "innerText").Equals(expected), "Actual [" + WebKeywords.Instance.GetAttribute(Element.lblErrorPassMsg, "innerText") + "] is not match with expected [" + expected + "]");
        }
    }
}