using AutomationFrameWork.Driver;
using AutomationFrameWork.Utils;
using NUnit.Framework;
using NUnit.Framework.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;

namespace AutomationFrameWork.Helper
{
    public class DriverHelper 
    {
        private static readonly DriverHelper _instance = new DriverHelper();
        public static List<int> UsedPort = new List<int>();
        private static readonly object _syncRoot = new Object();
        private static Dictionary<int, Boolean> _freePort = new Dictionary<int, Boolean>();
        static DriverHelper ()
        {
        }
        public static DriverHelper Instance
        {
            get
            {
                return _instance;
            }
        }
        /// <summary>
        /// This method use for set driver path
        /// Ex: chromedriver.exe,IEDriverServer.exe
        /// </summary>
        /// <returns></returns>
        public string DriverPath
        {
            get
            {
                return System.IO.Path.GetDirectoryName(AppDomain.CurrentDomain.BaseDirectory);
            }
        }
        /// <summary>
        /// This method is use for
        /// get all avaliable port in local system
        /// </summary>
        /// <param name="startingPort"></param>
        /// <returns></returns>
        public Dictionary<int,Boolean> GetAvailablePort (int startingPort,int endPort)
        {           
            IPEndPoint[] endPoints;
            List<int> portArray = new List<int>();
            Dictionary<int,Boolean> returnPort = new Dictionary<int, bool>();
            IPGlobalProperties properties = IPGlobalProperties.GetIPGlobalProperties();
            //getting active connections
            TcpConnectionInformation[] connections = properties.GetActiveTcpConnections();
            portArray.AddRange(from n in connections
                               where n.LocalEndPoint.Port >= startingPort
                               select n.LocalEndPoint.Port);
            //getting active tcp listners - WCF service listening in tcp
            endPoints = properties.GetActiveTcpListeners();
            portArray.AddRange(from n in endPoints
                               where n.Port >= startingPort 
                               select n.Port);
            //getting active udp listeners
            endPoints = properties.GetActiveUdpListeners();
            portArray.AddRange(from n in endPoints
                               where n.Port >= startingPort
                               select n.Port);
            //Add user port to list            
            portArray.AddRange(UsedPort);
            portArray.Sort();
            // Check for get Free Port 
            for (int i = startingPort; i <= endPort; i++)
                if (!portArray.Contains(i) && !UsedPort.Contains(i))
                {
                    if (!UsedPort.Contains(i))
                        returnPort.Add(i, true);
                    else
                        returnPort.Add(i, false);
                }
            return returnPort;
        }
        public List<int> GetPort ()
        {
            lock (_syncRoot)
            {
                List<int> returnPort = new List<int>();
                int count = 0;
                for (int n = 0; n < DriverHelper.Instance.FreePort.Count; n++)
                {
                    if (DriverHelper.Instance.FreePort.ElementAt(n).Value == true && count < 3)
                    {
                        returnPort.Add(DriverHelper.Instance.FreePort.ElementAt(n).Key);
                        UsedPort.Add(DriverHelper.Instance.FreePort.ElementAt(n).Key);
                        DriverHelper.Instance.FreePort[DriverHelper.Instance.FreePort.ElementAt(n).Key] = false;
                        count = count + 1;
                    }
                }
                return returnPort;
            }
        }

        public void ReleasePort(List<int> portRelease)
        {           
            for (int n = 0; n < portRelease.Count; n++)
            {
                UsedPort.Remove(portRelease.ElementAt(n));
                DriverHelper.Instance.FreePort[portRelease.ElementAt(n)] = true;
            }           
        }

        public Dictionary<int, Boolean> FreePort
        {
            get
            {
                lock (_syncRoot)
                {
                    return _freePort;
                }
            }
            set
            {
                lock (_syncRoot)
                {
                    try
                    {
                        foreach (KeyValuePair<int, Boolean> values in value)
                            for (int port = 0; port < DriverHelper.Instance.FreePort.Count || DriverHelper.Instance.FreePort.Count == 0; port++)
                            {
                                if (!DriverHelper.Instance.FreePort.ContainsKey(values.Key))
                                    _freePort.Add(values.Key, values.Value);
                                else
                                    _freePort[values.Key] = values.Value;
                            }
                    }
                    catch (ArgumentException e)
                    {
                        System.Console.WriteLine(e.Message);
                    }
                }
            }
        }   
    }
}
