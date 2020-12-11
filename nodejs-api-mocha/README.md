# restapi-automation

API Automation test project

## Set up

- Clone this project to your local (Ex:
  D:\sampleapp\github\sample-automation)
- Open cmd and go to source code folder (Ex:  
  D:\sampleapp\github\sample-automation)
  - Install all dependencies with command - npm install

## Run test:

Run test with command below:

> node index.js [options]

List command options are supported below:

- -h, --help :**Show help**

- -u, --username :**username to authenticate rest [default: null]**

- -p, --password :**password to authenticate rest [default: null]**

- --env :**env to run test [default: null]**

- -f, --restServiceConfig :**Service config file name. Config locate in config/runner folder [string][default: "production.config.json"]**

- --fd, --sftpServiceConfig :**EDI config file name. Config locate in config/runner folder**

- --namespace :**namespace store to run test [default: null]**

- -d, --debug :**Turn on debug mode and all data will not send to ReportPortal [boolean][default: false]**

- -t, --tags :**List of tags to run test [array]default: []]**

- --retries :**Retries failed tests n times. [default: 2]**

- -s, --scenarios :**path to test scripts [string][default: "scenarios"]**

- --alternativeAccounts, --listAccounts :**list accounts to authenticate [array]default: []]**

- --rp, --reportPortalConfig :**ReportPortal config file. Config locate in config/report folder [string][default: "reportportal.config.json"]**

- --rpln, --launchName :**Launch Name in ReportPortal [default: "sampleapp"]**

- --rpld, --launchDescription :**Launch Description in ReportPortal [default: "sampleapp"]**

- --rpltags, --launchTags :**Launch Tags in ReportPortal [array]default: []]**

- --rpsn, --suiteName :**Suite Name in ReportPortal [default: "sampleapp Suite"]**

- --rpsd, --suiteDescription :**Suite Description in ReportPortal [default: "sampleapp Suite"]**

- --rpstags, --suiteTags :**Suite Tags in ReportPortal [array]default: []]**

- --to, --timeout :**default timeout for tests [number][default: null]**

- --sftpUser :**username to authenticate sftp [default: null]**

- --sftpPass :**password to authenticate sftp [default: null]**

- --parallel :**enable/disable run test in parallel mode [default: true]**

**Sample command to run test:**

node index.js -s scenarios/Inventory -f debug.config.json -t abc --rp reportportal.debug.json --username your_username --password your_password --alternativeAccounts managerAccount:manager/managerpass adminAccount:admin/adminpass --sftpUser sample --sftpPass passsftp

## ReportPortal.io:

All test result when run without debug mode will send result to ReportPortal.io server http://localhost:8080. The test results are stored in project from command option --rp reportportal.debug.json
Account: superadmin/erebus
