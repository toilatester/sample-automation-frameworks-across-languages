using System;
using System.Diagnostics;
using System.Threading;

namespace AutomationFrameWork.Driver
{

    public class NodeFactory
    {        
        private int _portNumber, _bootstrapPort, _chromeDriverPort, _processID;
        private string _addressNumber;
        private Process _appiumServer;        
        static NodeFactory ()
        {
        }
        public static NodeFactory Instance
        {
            get
            {
                return NodeFactory.Node.Value;
            }
        }
        static ThreadLocal<NodeFactory> Node = new ThreadLocal<NodeFactory>(() =>
        {            
            return new NodeFactory();
        });
        /// <summary>
        /// This start node server for run appium
        /// </summary>
        /// <param name="addressNumber"></param>
        /// <param name="portNumber"></param>
        /// <param name="bootstrapPort"></param>
        /// <param name="timeOut"></param>
        public void  StrartNodeServer (String addressNumber, int portNumber, int bootstrapPort,int chromeDriverPort)
        {
            existNodeJS();
            this.AddressNumber = addressNumber;
            this.BootstrapPort = bootstrapPort;
            this.PortNumber = portNumber;
            this.ChromeDriverPort = chromeDriverPort;         
            _appiumServer = new Process();
            _appiumServer.StartInfo.FileName = "cmd";
            _appiumServer.StartInfo.Arguments = "/c node \""+ Environment.ExpandEnvironmentVariables("%APPIUM%\\node_modules\\appium\\build\\lib\\main.js") + "\" -a " + this.AddressNumber + " -p " + this.PortNumber + " -bp " + this.BootstrapPort + " --chromedriver-port " + this.ChromeDriverPort;
            _appiumServer.StartInfo.UseShellExecute = true;
            _appiumServer.StartInfo.RedirectStandardOutput = false;
            _appiumServer.Start();                    
            this.ProcessId = _appiumServer.Id;            
        }
        /// <summary>
        /// This set port number for appium can listen
        /// </summary>
        public int PortNumber
        {
            get
            {
                return _portNumber;
            }

            private set
            {
                _portNumber = value;
            }
        }
        /// <summary>
        /// This set address of Appium Server
        /// </summary>
        public string AddressNumber
        {
            get
            {
                return _addressNumber;
            }

            private set
            {
                _addressNumber = value;
            }
        }
        /// <summary>
        /// This set bootstrap port for node server
        /// </summary>
        public int BootstrapPort
        {
            get
            {
                return _bootstrapPort;
            }

            private set
            {
                _bootstrapPort = value;
            }
        }
        /// <summary>
        /// This set bootstrap port for node server
        /// </summary>
        public int ChromeDriverPort
        {
            get
            {
                return _chromeDriverPort;
            }

            private set
            {
                _chromeDriverPort = value;
            }
        }
        /// <summary>
        /// This method is use for
        /// get and set process id
        /// </summary>
        public int ProcessId
        {
            get
            {
                return _processID;
            }

            private set
            {
                _processID = value;
            }
        }
        /// <summary>
        /// This close node server with has PID 
        /// </summary>
        public void CloseNodeServer ()
        {            
            Process closeNodeServer = new Process();
            closeNodeServer.StartInfo.FileName = "Taskkill";
            closeNodeServer.StartInfo.Arguments = "/PID " + this.ProcessId;
            closeNodeServer.StartInfo.CreateNoWindow = true;
            closeNodeServer.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
            closeNodeServer.Start();                 
        }
        /// <summary>
        /// This method is use for
        /// Check node server running or not
        /// return true if appium sever not start
        /// </summary>
        /// <returns></returns>
        private Boolean isNodeServerStart ()
        {
            Thread.Sleep(5000);
            return (_appiumServer == null || _appiumServer.StandardOutput.ReadLine().Contains("started on"));
        }
        private void existNodeJS ()
        {
            if (Environment.ExpandEnvironmentVariables("%APPIUM%\\node_modules\\appium\\build\\lib\\main.js").Contains("%APPIUM%"))
                throw new OperationCanceledException("Can not find Nodejs.exe in environment, please check environment");
        }
    }
}

