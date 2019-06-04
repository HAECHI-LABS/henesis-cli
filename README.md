henesis-cli 
===========

[![License](https://img.shields.io/npm/l/@haechi-labs/henesis-cli.svg)](https://github.com/HAECHI-LABS/henesis-cli/blob/master/package.json) [![Version](https://img.shields.io/npm/v/@haechi-labs/henesis-cli.svg)](https://www.npmjs.com/package/@haechi-labs/henesis-cli) [![Platform](https://img.shields.io/node/v/@haechi-labs/henesis-cli.svg)](https://github.com/HAECHI-LABS/henesis-cli/blob/master/package.json) [![ci](https://travis-ci.com/HAECHI-LABS/henesis-cli.svg?branch=master)]()

## Getting Started

### Install

*_**To use henesis-cli, Node v10 or higher must be installed.**_*

```sh-session
$ npm install -g @haechi-labs/henesis-cli

$ henesis help

VERSION
  @haechi-labs/henesis-cli/1.0.0-beta.14 darwin-x64 node-v10.15.3

USAGE
  $ henesis [COMMAND]

COMMANDS
  changepw     change password
  help         display help for cli
  init         create the folder structure required for your project
  integration  manage integrations
  login        Perform a login
  logout       Perform a logout
```

### Usage

1. help

Use help as:
```sh-session
  $ henesis help [COMMAND]
```
For example, you can call `help` about `integration:delete` command like:
```
$ henesis help integration:delete
delete a integration

USAGE
  $ henesis integration:delete [INTEGRATIONID]

EXAMPLE
  $ henesis integration:delete
```



2. login

```sh-session
$ henesis login
Allow Henesis to collect anonymous CLI usage and error reporting information
yes(y) or no(n): y
email: yoonsung@haechi.io
password: ***********

🎉 Login Success from yoonsung@haechi.io 🎉
```



3. init

*_**The directory in which the init command is run must be empty.**_*

```sh-session
$ henesis init -n sample-project
sample-project directory has been created.
```

After this, the following folder structure is created.

```
sample-project/
├─ contract/
│  └─ example.sol
├─ handler/
│  ├─ execution.ts
│  └─ execution2.ts
└─ henesis.yaml
```



4. integration

*_**You can use command where the henesis.yaml file exists.**_*

```sh-session
$ henesis integration
manage integrations

USAGE
  $ cli integration:COMMAND

COMMANDS
  integration:delete    delete a integration
  integration:deploy    deploy a integration
  integration:describe  describe a integration
  integration:status    get integrations
```

There are tasks to be done before the deploy command.

- Place the contract file distributed in Blockchain inside the contract directory.
- Modify the henesis.yaml file to match the event you want to subscribe to and place the file with logic in the handler directory.
- You can run the deploy command and check the status of the distribution through the status command.


5. change password

*_**You must be logged in to use this feature.**_*

```sh-session
$ henesis changepw
Password: ******
New Password: ******
Again New Password: ******
🦄 Password changed!

```


6. logout

```sh-session
$ henesis logout
🤗 Logout Success 👍
```
