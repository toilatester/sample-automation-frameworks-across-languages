using AutomationFrameWork.Base;

namespace AutomationTesting.POM.TestFramework
{
    class TestFrameworkAction : BasePageWeb<TestFrameworkAction,TestFrameworkElement,TestFrameworkValidate>
    {
        public string Message { get; set; }
        public bool CheckSingleton()
        {
            Message =Message + " Check if it can show in test";
            return false;
        }
        public void DoSomething(string message)
        {
            Message = Message + " "+message;
        }
        public TestFrameworkAction DoSomeThing()
        {
            System.Console.WriteLine("Check Do Some Thing");
            return this;
        }
        public TestFrameworkAction PrintSomeThing()
        {
            System.Console.WriteLine("Check Print Some Thing");
            return this;
        }
    }
}
