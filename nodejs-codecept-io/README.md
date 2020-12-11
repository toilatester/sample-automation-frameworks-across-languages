# gui-automation with codecept.io

GUI Automation test project

## Set up

- Open cmd and go to source code folder after clonning it (Ex:

D:\github\gui-with-codecept)

- Install all dependencies with command below: - `npm install`

## Run test:

### Run test with command below:

> node index.js [options]

### List command options are supported below:

**Command Options**:

    --version Show version number [boolean]

    --stepsDefinition Generat steps.d.ts for type hint [boolean] [default: false]

    --grep pattern to filter test scripts, grep @smoke will run all test with tag name @smoke [string]

    --scenariosTestPattern, -s path to test scripts, pattern must be defined inside single-quote Ex: '*.js','*test.js' [string] [required]

    --guiRunConfig Execute GUI test config file name. Config locate in the config/runner/gui folder[string] [required]

    --restRunConfig Execute rest service config file name. Config locate in the config/runner/rest.service folder [string] [required]

    --sftpRunConfig Execute sftp service config file name. Config locate in the config/runner/sftp.service folder [string] [required]

    --reportPortalConfig Execute config file name. Config locate in config/report folder [string] [required]

    --username, -u username to authenticate [string] [required]

    --password, -p password to authenticate [string] [required]

    --namespace namespace to run gui test [string] [required]

    --impersonateUserName impersonateUserName to authenticate [string] [required]

    --retries Retries failed test [number] [default: 2]

    --width Browser width viewport [number] [default: 1920]

    --height Browser height viewport [number] [default: 1080]

    --maximize Set maximize browser [boolean] [default: true]

    --output Set report output folder [string] [default: "reports"]

    --launchName Launch Name in ReportPortal

    --launchDescription Launch Description in ReportPortal [default: "sampleapp"]

    --launchTags Launch Tags in ReportPortal [array] [default: []]

    --suiteName Suite Name in ReportPortal

    --suiteDescription Suite Description in ReportPortal [default: "sampleapp Suite"]

    --suiteTags Suite Tags in ReportPortal [array] [default: []]

    --headless Turn on/off headless mode and all data will not send to ReportPortal [boolean] [default: true]

    --debug Turn on/off debug mode and all data will not send to ReportPortal [boolean] [default: false]

    --outputConsole Turn on/off log to console [boolean] [default: true]

    --help Show help [boolean]

**Sample command to run test:**

    node index.js --scenariosTestPattern '*.js' --guiRunConfig debug.config.json --restRunConfig debug.config.json --sftpRunConfig debug.config.json --reportPortalConfig reportportal.minh.json -u your_username -p your_password --namespace env_qa_auto --impersonateUserName env_qa_auto --launchName GUI_DEBUG_INTEGRATION --grep @debug

## ReportPortal.io:

All test result when run without debug mode will send result to ReportPortal.io server http://localhost:8080. The test results are stored in project from command option --rp reportportal.debug.json

Account: superadmin/erebus
