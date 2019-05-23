henesis-cli
===========

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

[![Version](https://img.shields.io/npm/v/cli.svg)](https://www.npmjs.com/package/@haechi-labs/henesis-cli)

[![Downloads/week](https://img.shields.io/npm/dw/cli.svg)](https://www.npmjs.com/package/@haechi-labs/henesis-cli)

[![License](https://img.shields.io/npm/l/cli.svg)](https://github.com/HAECHI-LABS/henesis-cli/blob/master/package.json)

## Getting Started

### Install

*_**To use henesis-cli, Node v10 or higher must be installed.**_*

```sh-session
$ npm install -g @haechi-labs/henesis-cli

$ henesis help

VERSION
  henesis-cli/0.1.0 darwin-x64 node-v10.15.3

USAGE
  $ henesis [COMMAND]

COMMANDS
  help         display help for cli
  init         describe the command here
  integration  manage integrations
  login        Perform a login
  logout       Perform a logout
```

### Usage

1. login

```sh-session
$ henesis login
Allow Henesis to collect anonymous CLI usage and error reporting information
yes(y) or no(n): y
email: yoonsung@haechi.io
password: ***********

🎉 Login Success from yoonsung@haechi.io 🎉
```



2. init

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



3. integration

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



4. logout

```sh-session
$ henesis logout
🤗 Logout Success 👍
```
