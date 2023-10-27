---
layout: post
title: "NodeJS & NPM"
tags: [Web Dev, Backend]
toc: true
icon: nodejs.png
notfull: 1
keywords: "js javascript package management Node Manager npm nvm node nodejs yarn js cli env environment"
date: 2022-10-27
---

{% assign img-url = '/img/post/js/gatsby' %}

## Install NodeJS & NPM

### Install multiple versions

First, need to [install nvm](https://github.com/nvm-sh/nvm). Run the line of `curl` and then run/add-to-zsh the line of `export`.

::: warning
Below commands are mostly for Linux/MacOS users.
:::

::: danger
**For Mac M1**: You may encouter error `Target architecture arm64 is only supported on arm64 and x64 host` when installing NodeJS version <= 14 with `nvm`. Just open Terminal using Rosetta (right click on Terminal.app > Get info > tick "Open using Rosetta") and then run the installation command again. 💡 **Tip**: You can create a separated **Terminal Rosetta.app** just in case you wanna install something using Rosetta.
:::

::: col-2-equal
``` bash
# FIRST INSTALL: the most recent lts release
nvm install --lts
```

``` bash
# install a specific version
nvm install 12.13.0
```

``` bash
# install latest version
nvm install node
```

``` bash
# list all installed versions
nvm ls
```

``` bash
# set default version of node
nvm alias default 12.13.0
```

``` bash
# full list of available versions
# be careful, it's too long!!!
nvm ls-remote
```

``` bash
# switch between versions
nvm use 12.13.0
# or (more quickly)
nvm use v15
```

``` bash
# uninstall some version
nvm uninstall 12.13.0
```
:::



### Single version

:point_right: Install NodeJS and NPM: [Windows & MacOS](https://nodejs.org/en/download), [Linux](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions).

::: col-2-equal
``` bash
# UPDATE npm
npm cache clean -f # clear the cache first
sudo npm install -g npm
```

``` bash
# UPDATE node
sudo npm install -g n
sudo n stable
# refresh the shell
source ~/.zshrc # if using zsh
source ~/.bashrc # is using bash
```

``` bash
# Check version
npm -v
node -v
```
:::

### Shorthand CLI options

<div class="two-columns-list" markdown="1">

- `i`: `install`
- `-D`: `--save-dev` (`devDependencies`)
- `-P`: `--save-prod` (default), `--save`
- `-g`: `--global`
- `-f`: `--force`
- `ls`: `list`
</div>

## Install packages

👉 [Official documentation](https://docs.npmjs.com/cli/install#:~:text=Install%20the%20dependencies%20in%20the,json%20.).

``` bash
npm install package_name # if it's in package.json, the indicated version will be installed
                         # otherwise, the newsest version will be installed
npm install --global package_name # global package
```

``` bash
# install all package in package.json
npm install
```

``` bash
# install + save to package.json
npm install --save package_name # save to package.json
npm install --save-dev package_name # save to package.json, in devDependencies
npm install --no-save package_name # don't save
```

``` bash
# install with version
npm install express@4.16.1
```

``` bash
# install a local package
npm install /path/to/package
```

``` js
// from github repository
npm i git+https://github.com/abc/xyz.git // https
npm i git+https://<github repo>#<new_commit_hash> // a specific commit
// or
npm i git+ssh://git@github.com/abc/xyz.git // ssh
```

``` bash
# list all installed packages (current project only)
ls node_modules
```

``` bash
# list all local (installed) packages
npm list # -g for globel # or use "ls"
npm list --depth=0 # without dependencies

# Check the current version of a (installed) package
npm list package_name # with "-g" for global

# Check the latest (not current) version of a package
npm view package_name version
```

``` bash
# Set python2 by default when installing npm packages
npm config set python python2
```

## Update packages

::: col-2-equal
``` bash
# which global packages need to be updated?
npm outdated -g --depth=0

# update all global packages
npm update -g
```

``` bash
# update a package
npm update package_name # -g for global
```
:::

## Remove packages

``` bash
npm uninstall package
```

## Update package.json (npm version)

👉 [Semantic Versioning 2.0.0 | Semantic Versioning](https://semver.org/)
👉 [npm-version | npm Docs](https://docs.npmjs.com/cli/v8/commands/npm-version)

```bash
# Version: 1.2.3
# means: breaking.feature.fix

npm version patch # 1.0.0 -> 1.0.1 (fixes)
npm version minor # 1.0.1 -> 1.1.0 (new features )
npm version major # 1.1.0 -> 2.0.0 (completely new APIs)
```

## Run scritps

``` bash
# Install first
npm i --save npm-run-all
```

::: col-2-equal

``` json
// Run sequentially,
// package.json
"scripts": {
	"build": "run-s prod:*", // "run-s" = "npm-run-all -s"
	"prod:eleventy": "eleventy",
	"prod:parcel": "parcel build ./ -o ./",
}
```

``` json
// Run parallely,
// package.json
"scripts": {
	"start": "npm-run-all --parallel dev:*",
	"dev:eleventy": "eleventy --serve",
	"dev:parcel": "parcel watch ./ -o ./",
}
```
:::

## Console.log things

Sometimes, we wanna log the results for debugging, but it appears `[Object]` (for example) all time.

```js
import { inspect } from 'util';
console.log(inspect(
  myObject,
  {
    showHidden: false,
    depth: null,
    colors: true
  }
));

// One line
console.log(inspect(myObject, {showHidden: false, depth: null, colors: true}))
```

```js
// Without module
const util = require('util')
console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}));
```



## Troubleshooting

:eight_pointed_black_star: _[Error: EACCES: permission denied, open '/Users/thi/.ngrok/..._

```bash
# Error
sudo npm install ngrok -g

# Check the permission
ls -la /Users/thi/.ngrok

# Change the permission to "thi"
sudo chown -R $USER /Users/thi/.ngrok
```

