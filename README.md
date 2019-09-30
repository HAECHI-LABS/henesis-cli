# henesis-cli 
🚀 Command Line Interface tool to Utilize henesis

[![License](https://img.shields.io/npm/l/@haechi-labs/henesis-cli.svg)](https://github.com/HAECHI-LABS/henesis-cli/blob/master/package.json) [![Version](https://img.shields.io/npm/v/@haechi-labs/henesis-cli.svg)](https://www.npmjs.com/package/@haechi-labs/henesis-cli) [![Platform](https://img.shields.io/node/v/@haechi-labs/henesis-cli.svg)](https://github.com/HAECHI-LABS/henesis-cli/blob/master/package.json) [![ci](https://travis-ci.com/HAECHI-LABS/henesis-cli.svg?branch=master)]()


## Install

*_**To use henesis-cli, Node v10 or higher must be installed.**_*

```
$ npm install -g @haechi-labs/henesis-cli

$ henesis help

VERSION
  @haechi-labs/henesis-cli/1.0.0-beta.29 darwin-x64 node-v10.16.0

USAGE
  $ henesis [COMMAND]

COMMANDS
  changepw     change password
  help         display help for henesis
  init         create the folder structure required for your project
  integration  manage integrations
  login        perform a login
  logout       perform a logout
  node         get node status
```



### How to Setup Henesis AutoComplete

```
$ henesis autocomplete
```

Enter the following script according to your shell type.

zsh: 
> $ printf "$(henesis autocomplete:script zsh)" >> ~/.zshrc; source ~/.zshrc


bash:
> $ printf "$(henesis autocomplete:script bash)" >> ~/.bashrc; source ~/.bashrc



## Usage

#### changepw

##### Command Line

```
$ henesis changepw
Password: ******
New Password: ******
Again New Password: ******
🦄 Password changed!
```

------

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

------

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

------

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
henesis integration:status
```

------

### login

```
$ henesis login
Allow Henesis to collect anonymous CLI usage and error reporting information
yes(y) or no(n): y
email: yoonsung@haechi.io
password: ***********

🎉 Login Success from yoonsung@haechi.io 🎉
```

------

### logout

```
$ henesis logout
🤗 Logout Success 👍
```

------

### node

```
get node status

USAGE
  $ henesis node:COMMAND

COMMANDS
  node:status  get node status
```

#### node:status

##### Command Line

```
Platform     Network   Endpoint                                   Status
ethereum     mainnet   http://network.henesis.io/ethereum/mainnet Synced
ethereum     ropsten   http://network.henesis.io/ethereum/ropsten Synced
ethereum     rinkeby   http://network.henesis.io/ethereum/rinkeby Synced
klaytn       mainnet   http://network.henesis.io/klaytn/mainnet   Synced
klaytn       baobab    http://network.henesis.io/klaytn/baobab    Synced
```



## About henesis.yaml

### webSocket

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



### webhook

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



## parameter details

The following are detailed explanations for parameters used to `henesis.yaml`.

### version & name

The `version` and `name` are used as delimiters to identify the project. The `name` must consist only of lowercase letters, numbers, '-' and '.', the maximum length is 253 characters.

------

### blockchain

The blockchain part is an area that describes the platform and network name of the blockchain in which the smart contract to e subscribed is deployed.

##### platform

The blockchain platform you want to use. 

We support now

- `ethereum`
- `klaytn`

##### network

The blockchain network you want to use.

We support now below chains.

| platform | network | chain           |
| -------- | ------- | --------------- |
| ethereum | mainnet | mainnet         |
| ethereum | ropsten | ropsten testnet |
| ethereum | rinkeby | rinkeby testnet |
| klaytn   | mainnet | cypress mainnet |
| klaytn   | baobob  | baobob testnet  |

##### threshold

Minimum confirmation thresohld which you want to received.

> Caution : when receiving data, we wait for a threshold of block confirmation.

------

### filters

The filters part is about information for the smart contracts you want to subscribe through Henesis. 

> You can subscribe to more than one contract.

##### contracts

###### address

Address of smart contract

###### path

Directory path of solidity file

###### name

Name of smart contract

###### compilerVersion

The version of the compiler used when the original file of the deployed smart contract was compiled.

------

### provider

The provider is where you choose how to receive events from Henesis. We support `WebSocket` and `Webhook`

The `WebSocket` doesn't need any settings like url, method, retry, headers.

##### type

`WebSocket` or `Webhook`

##### url

URL which you want to hook

##### method

HTTP method like a `GET`, `POST`, `PUT`, `DELETE`

##### retry

###### retryDelay

Retry Interval (ms)

###### maxRetries

Maximum retry count

##### headers

###### Authorization

If you want to set authorization (like a `JWT`), you can set authorization

> We also support [tutorial](https://docs.henesis.io/undefined-3/untitled/henesis.yaml).
