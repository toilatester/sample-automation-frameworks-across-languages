SonarQube.Scanner.MSBuild.exe begin /k:"Temp" /v:"1.0" /d:sonar.host.url=http://localhost:8080 /d:sonar.visualstudio.testProjectPattern=Ignore.ignore /d:sonar.msbuild.testProjectPattern=Ignore.ignore /d:sonar.inclusions=**.cs /d:sonar.log.level=TRACE /d:sonar.verbose=true /d:sonar.showProfiling=true
MSBuild.exe /t:Rebuild 
SonarQube.Scanner.MSBuild.exe end