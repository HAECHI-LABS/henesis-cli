<a name="unreleased"></a>
## [Unreleased]


<a name="v1.0.0-beta.29"></a>
## [v1.0.0-beta.29] - 2019-09-23
### Feat
- add node:status


<a name="v1.0.0-beta.28"></a>
## [v1.0.0-beta.28] - 2019-09-17
### Chore
- update v1.0.0-beta.28
- refine compiler version error messages ([#89](https://github.com/HAECHI-LABS/henesis-cli/issues/89), [#90](https://github.com/HAECHI-LABS/henesis-cli/issues/90))
- update v1.0.0-beta.27


<a name="v1.0.0-beta.27"></a>
## v1.0.0-beta.27 - 2019-09-09
### Chore
- update v1.0.0-beta.25
- update readme for yaml config
- remove blockchain interval property in yaml file ([#85](https://github.com/HAECHI-LABS/henesis-cli/issues/85))
- format help commands desc
- add CI ([#13](https://github.com/HAECHI-LABS/henesis-cli/issues/13))
- delete .vscode/ and ignore it

### Docs
- update readme

### Feat
- catch sol compiler error
- 1.0.0-beta.22
- support http protocol in config -e
- add 503 error catcher
- update integration class
- update template and init command based on new IntegrationSpec
- update integration deploy command based on new IntegrationSpec
- update integration type and status command
- init with force ([#62](https://github.com/HAECHI-LABS/henesis-cli/issues/62))
- specific anon user, dimension ([#59](https://github.com/HAECHI-LABS/henesis-cli/issues/59))
- git clone use template. ([#56](https://github.com/HAECHI-LABS/henesis-cli/issues/56))
- relocated base command & customized endpoint ([#55](https://github.com/HAECHI-LABS/henesis-cli/issues/55))
- improvement Testcase ([#54](https://github.com/HAECHI-LABS/henesis-cli/issues/54))
- evm version fix ([#52](https://github.com/HAECHI-LABS/henesis-cli/issues/52))
- improve error message ([#46](https://github.com/HAECHI-LABS/henesis-cli/issues/46))
- add more info at subcommand example
- ignore solidity compile warning message ([#35](https://github.com/HAECHI-LABS/henesis-cli/issues/35))
- latest beta ([#34](https://github.com/HAECHI-LABS/henesis-cli/issues/34))
- add analytics. ([#25](https://github.com/HAECHI-LABS/henesis-cli/issues/25))
- impl init command. ([#24](https://github.com/HAECHI-LABS/henesis-cli/issues/24))
- update hook. ([#22](https://github.com/HAECHI-LABS/henesis-cli/issues/22))
- implementation login command. ([#21](https://github.com/HAECHI-LABS/henesis-cli/issues/21))
- implemetation User RPC ([#20](https://github.com/HAECHI-LABS/henesis-cli/issues/20))
- implements analytics check hook. ([#19](https://github.com/HAECHI-LABS/henesis-cli/issues/19))
- implements config store ([#18](https://github.com/HAECHI-LABS/henesis-cli/issues/18))
- implement deploy command
- implement getIntegrationById, refactor: change integrationRpc patch to put
- implement example contract, spec, handler
- implement compiler module
- implement integration:status, integration:describe, integration:delete command
- add init hook for wretch
- implement intergrationRpc

### Fix
- when error some evm version. ([#51](https://github.com/HAECHI-LABS/henesis-cli/issues/51))
- fix evmVersion bug ([#50](https://github.com/HAECHI-LABS/henesis-cli/issues/50))
- change compiler cache directory name ([#49](https://github.com/HAECHI-LABS/henesis-cli/issues/49))
- 2space to 1sapce
- fix load dep file error and add more detailed error ([#33](https://github.com/HAECHI-LABS/henesis-cli/issues/33))
- latest publish ([#32](https://github.com/HAECHI-LABS/henesis-cli/issues/32))
- latest publish
- version up
- delete user config when get unauthorized error
- fix conflict
- fix typo and prettify console msg
- add nock to package.json and fix typo

### Mod
- dashboard link ([#42](https://github.com/HAECHI-LABS/henesis-cli/issues/42))
- template upgrade ([#38](https://github.com/HAECHI-LABS/henesis-cli/issues/38))
- update version ([#37](https://github.com/HAECHI-LABS/henesis-cli/issues/37))
- move configstore path ([#30](https://github.com/HAECHI-LABS/henesis-cli/issues/30))
- use cli-ux table ([#29](https://github.com/HAECHI-LABS/henesis-cli/issues/29))
- readme, cli to henesis. ([#28](https://github.com/HAECHI-LABS/henesis-cli/issues/28))

### Refactor
- remove provider connectionlimit property
- add default error catcher and refine rpc error message
- dynamically test integration id
- dynamically test integration id
- change promise to await/async ([#11](https://github.com/HAECHI-LABS/henesis-cli/issues/11))

### Style
- apply lint ([#41](https://github.com/HAECHI-LABS/henesis-cli/issues/41))
- apply lint, lint script and husky ([#14](https://github.com/HAECHI-LABS/henesis-cli/issues/14))


[Unreleased]: https://github.com/HAECHI-LABS/henesis-cli/compare/v1.0.0-beta.29...HEAD
[v1.0.0-beta.29]: https://github.com/HAECHI-LABS/henesis-cli/compare/v1.0.0-beta.28...v1.0.0-beta.29
[v1.0.0-beta.28]: https://github.com/HAECHI-LABS/henesis-cli/compare/v1.0.0-beta.27...v1.0.0-beta.28