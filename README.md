# henesis-cli 

[![License](https://img.shields.io/npm/l/@haechi-labs/henesis-cli.svg)](https://github.com/HAECHI-LABS/henesis-cli/blob/master/package.json) [![Version](https://img.shields.io/npm/v/@haechi-labs/henesis-cli.svg)](https://www.npmjs.com/package/@haechi-labs/henesis-cli) [![Platform](https://img.shields.io/node/v/@haechi-labs/henesis-cli.svg)](https://github.com/HAECHI-LABS/henesis-cli/blob/master/package.json) [![ci](https://travis-ci.com/HAECHI-LABS/henesis-cli.svg?branch=master)]()



## Install

*_**To use henesis-cli, Node v10 or higher must be installed.**_*

```
$ npm install -g @haechi-labs/henesis-cli

$ henesis help

VERSION
  @haechi-labs/henesis-cli/1.0.0-beta.24 darwin-x64 node-v10.16.0

USAGE
  $ henesis [COMMAND]

COMMANDS
  changepw     change password
  help         display help for henesis
  init         create the folder structure required for your project
  integration  manage integrations
  login        perform a login
  logout       perform a logout
```

## Usage

### help

Use help as:

```
  $ henesis help [COMMAND]
```

For example, you can call `help` about `integration:delete` command like:

```
$ henesis help integration:delete
delete a integration

USAGE
  $ henesis integration:delete [INTEGRATIONID]

EXAMPLE
  $ henesis integration:delete my-integration-id
```



### login

```
$ henesis login
Allow Henesis to collect anonymous CLI usage and error reporting information
yes(y) or no(n): y
email: yoonsung@haechi.io
password: ***********

🎉 Login Success from yoonsung@haechi.io 🎉
```



### init

*_**The directory in which the init command is run must be empty.**_*

```
$ henesis init -n sample-project
sample-project directory has been created.
```

**After this, the following folder structure is created.**

```
sample_project
├── contracts
│   └── example.sol
└── henesis.yaml
```

**About henesis.yaml**

**webSocket**

```yaml
version: v1
name: projectname

blockchain:
  platform: ethereum
  network: mainnet
  threshold: 12

filters:
  contracts:
    - address: '0x'
      path: ./contracts/example.sol
      name: example
      compilerVersion: 0.5.8

provider:
  type: webSocket
```

**webhook** 

```yaml
version: v1
name: projectname

blockchain:
  platform: ethereum
  network: mainnet
  threshold: 12

filters:
  contracts:
    - address: '0x'
      path: ./contracts/example.sol
      name: example
      compilerVersion: 0.5.8

provider:
  type: webhook
  url: https://localhost:8080
  method: POST
  retry:
    retryDelay: 1000
    maxRetries: 3
  headers:
    Authorization: 'Bearer YOUR-OWN-TOKEN'
```

`thresohld` is minimum confirmation thresohld which you want to received.


### integration

*_**You can use command where the henesis.yaml file exists.**_*

```
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

#### integration:delete

##### Command Line

```
$ henesis integration:delete <integrationId>
```

#### integration:deploy

##### Command Line

```
$ henesis integration:deploy
```

##### Options

- `-f` or `--force`: Erase existing deployed content and deploy current configuration.
- `-p` or `--path`: Specify where henesis.yaml is located.

#### integration:describe

##### Command Line

```
henesis integration:describe <integrationId>
```

#### integration:status

##### Command Line

```
henesis integration:describe <integrationId>
```



### change password

*_**You must be logged in to use this feature.**_*

```
$ henesis changepw
Password: ******
New Password: ******
Again New Password: ******
🦄 Password changed!
```

### logout

```
$ henesis logout
🤗 Logout Success 👍
```
