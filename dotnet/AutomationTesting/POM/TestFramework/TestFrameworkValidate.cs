using AutomationFrameWork.Base;
using NUnit.Framework;
namespace AutomationTesting.POM.TestFramework
{
    class TestFrameworkValidate : BaseWebValidation<TestFrameworkElement>
    {
        public TestFrameworkValidate ValidateTrue(bool check)
        {
            Assert.True(check);
            return this;
        }
        public TestFrameworkValidate ValidateFalse(bool check)
        {
            Assert.True(check);
            return this;
        }
        public TestFrameworkValidate ValidateString(string message)
        {
            Assert.True(message.Length>5);
            return this;
        }
    }
}
