---
layout: post
title: "VSCode"
tags: [Skills]
toc: true
icon: vsc.png
keywords: "visual studio code vsc regex regular expression ssh remote server character combining font ligatures couple characters symbols letters new characters installation install extension plugin add extra path to auto complete reStructuredText rst markdown extension pythonremote regular expression regex vscode live server scss css compiler autopep8 formatter"
date: 2022-11-14
---

## Install

Download and install [here](https://code.visualstudio.com/).

### Using VSCode in terminal

Open VSCode > [[cmd]] + [[shift]] + [[P]] > Type "shell command" > Select "Install code command in path" > Navigate to any project on terminal and type `code .` top open it.

## Extensions

``` bash
# list the installed extensions
# unix
code --list-extensions | xargs -L 1 echo code --install-extension
# windows
code --list-extensions | % { "code --install-extension $_" }

# To re-install on a new machine
# just copy-paste the results and run on terminal
```

### reStructuredText

`preview engine sphinx is not installed` => in Ubuntu 20.04+

``` bash
sudo apt install python-is-python3
# prevent Python 2 from being installed as a dependency of something
sudo apt-mark hold python2 python2-minimal python2.7 python2.7-minimal libpython2-stdlib libpython2.7-minimal libpython2.7-stdlib
```

## Add extra path to auto complete

Open `settings.json` and add,

~~~ json
{
	"python.autoComplete.extraPaths": [
		"C:\\Users\\dinha\\Documents\\GitHub\\dataswati\\python-dataswati"
	],
}
~~~

### Fix Pylint unable to import

Open `settings.json` and add,

~~~ json
"python.linting.pylintArgs": [
	"--init-hook",
	"import sys; sys.path.append('C:\\Users\\dinha\\Documents\\GitHub\\dataswati\\python-dataswati')"
]
~~~

## Appearances

👉 Change font for internal terminal? Read [this section](#change-font-for-internal-terminal).

### Enable font ligatures

For example, you type [[>]] + [[=]], it becomes `≥`.

1. Download [Fira Code Font](https://www.fontsquirrel.com/fonts/fira-code).
2. Extract and then install the font after that.

	~~~ json
	{
	"editor.fontFamily": "'Fira Code', 'Consolas', 'Courier New', monospace",
	"editor.fontLigatures": true
	}
	~~~
3. Reload VSC.

💡 If you only wanna apply this setting for some file format, you can click on the language at the bottom right of VSC, then click **Configure 'Markdown' language based setting**.

## Regular Expression

👉 [Official doc](https://docs.microsoft.com/en-us/visualstudio/ide/using-regular-expressions-in-visual-studio?view=vs-2017) of using regex in vscode.

::: col-2-equal
``` bash
# Replace
http://bit.ly/abc
# with
[http://bit.ly/abc](http://bit.ly/abc)

# Finding box
(http://bit.ly.*)
# replace box
[$1]($1)
```

``` bash
# Replace
**Course 1**
# with
Course 1

# Finding box
\*\*Course (.*)\*\*
# replace box
Course $1
```
:::


``` bash {% raw %}
# Replace
::: col-2-equal
content
:::

# with
<div class="col-2-equal">

content
</div>

# In find box -> the key: [\s\S\r]*?
::: col-2-equal([\s\S\r]*?):::

# In replace box
<div class="col-2-equal">\n$1</div>
{% endraw %}
```

## Exlude files/folders in search results

Go to **Preferences** > **Settings** > search `exclude` and modify inside section `Search: Exclude`. More patterns can be found [here](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options).

::: hsbox An example list
~~~ bash
**/node_modules
**/bower_components
**/*.code-search
**/_site
**/.jekyll-cache
**/.sass-cache
**/*.ico
**/*.png
**/*.ipynb
**/*.jpg
**/*.jpeg
**/*.svg
~~~
:::

## Connect `ssh` folders in VSC

Read [this tutorial](https://code.visualstudio.com/blogs/2019/07/25/remote-ssh).

1. Install extension [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)
2. **View** > **Command Palette...** > type "SSH" and choose "_Remote-SSH: Connect to Host..._" > choose "_+ Add New SSH Host..._"
3. Type `ssh user@host` > [[Enter]] > choose a file to be updated, e.g. `~/.ssh/config`.
4. Click **Connect** if there is any popup in VSC.
5. Choose platform on the server, usually Linux.

### Error?

::: hsbox Could not establish connection to "undefined". Could not resolve hostname.

```bash
#
# ref: https://github.com/microsoft/vscode-remote-release/issues/1047

# Open config ssh file
# Ctrl+Shift+P then "Remote-SSH: Open Configuration File"

# In stead of
Host XXX.XXX.XXX.XXX
User bob
Port 22
IdentityFile ~/.ssh/id

# use this
Host server_name # Do not put ip here
HostName XXX.XXX.XXX.XXX # But put it here
User bob
Port 22
IdentityFile ~/.ssh/id

# Then Ctrl+Shift+P > "Remote-SSH: Connect to host"
# Pick "server_name"
```

:::

::: hsbox `autopep8` formatter not working?

I don't what I've done to make it work again, just try:

1. Re-initialize the formmater => You have to make VSCode ask you again about the formatter > choose an interpreter > install again `autopep8`
2. Re-install `autopep8` (`pip uninstall autopep8` then `pip install autopep8`)
3. Reload the window each try.

:::


## Settings

👉 Check [this file](https://github.com/dinhanhthi/scripts/blob/master/settings/VSC_settings.json).

Use settings for a custom file extension,

``` json
# the list of extension name will be showed when typing
"[markdown]": {
    "editor.tabSize": 4,
},
"[restructuredtext]": {
    "editor.wordWrap": "on",
}
```

### Work with multiple workspace

💡A tip to work with ==different workspace in the same screen== (Because it's difficult to distinguish "quickly" between opened windows) => **change color scheme for each workspace**!

In the current workspace > Go to "*Preferences*" > *Settings* > Click on tab "*Workspace*" > *Workbench* > *Appearance* > *Color Theme*.

### Snippets

💡 **Why need?** Quickly add a long snippet of text (with suggestion) with several keywords. For example, I add `###Thi console.log()` when debugging codes in JS. Then, I search the whole project for the line  `console.log()` that I forgot to delete.

**How?** Open *Preferences* > *User Snippets* > either you create a global file or type and find a good format (for example, type "markdown" and create snippets for this format only).

```bash
# Only available to js and typescript files
# Usage: type "logt" to add
# /*###Thi*/ console.log(...);
"[JS] Print to console": {
  "scope": "javascript,typescript",
  "prefix": "logt",
  "body": "/*###Thi*/ console.log('$1');",
  "description": "Log output to console"
},
```

**Note**: In order for snippets ==working with markdown file==, you have to add below settings (VSCode's `settings.json`)

```json
"[markdown]": {
  "editor.quickSuggestions": true
}
```

::: hsbox Some of my snippets

```bash
"[JS] Print to console": {
    "scope": "javascript,typescript",
    "prefix": "logt",
    "body": "/*###Thi*/ console.log('$1');",
    "description": "Log output to console"
  },
  "[JS] Point a debugger": {
    "scope": "javascript,typescript",
    "prefix": "deb",
    "body": "/*###Thi*/ debugger;",
    "description": "Make a debugger point here"
  },
  "[JS] TODO": {
    "scope": "javascript,typescript",
    "prefix": "todo",
    "body": "/*###TODO: */",
    "description": "Create a todo."
  },
  "[JS] Thi": {
    "scope": "javascript,typescript",
    "prefix": "thi",
    "body": "/*###Thi*/",
    "description": "Test of Thi, remove later!"
  },
  "[JS] Back Logger Debug": {
    "scope": "javascript,typescript",
    "prefix": "logger",
    "body": "Logger.debug('$1'); /*###Thi*/",
    "description": "Log debug output on back"
  },
  "[MD] Details": {
    "prefix": "detail",
    "body": "<details>\n<summary>$1</summary>\n\n$2\n</details>",
    "description": "Details"
  }
```

:::

### Other settings

:eight_spoked_asterisk:  Show the verticle line for blocks (indentation guides): `"editor.guides.indentation": false,`

## Pylint

``` bash
# _Unable to import_ some user-defined package
# 1. Make sure the right env running in vscode
# For example, popai (conda)
# 2. Make a symblic link
ln -s /home/thi/git/dataswati/python-dataswati/popai /home/thi/miniconda3/envs/popai/lib/python3.8/popai
```

``` bash
# unresolved import
# Ctrl + Shift + P
# Preferences: Open Workspace Settings (JSON)
"settings": {
    "python.pythonPath": "/usr/bin/python3",
    "python.autoComplete.extraPaths": [
        "/usr/lib/python3/dist-packages",
        "/app/src/python/"
        # or other paths you want!
    ]
}
```

:eight_spoked_asterisk: Disable tslint

```json
{
  "settings": {
    "typescript.validate.enable": false,
    "javascript.validate.enable": false
  }
}
```

### Ignore some pylint for jupyter notebook

👉 Note: [Jupyter Notebook](/jupyter-notebook/).

Just place before the line like this,

``` python
# pyright: reportMissingImports=false, reportUnusedVariable=warning, reportUntypedBaseClass=error
import frontmatter
```

## Terminal

### Change font for internal terminal

Make a good corresponding to [zsh](/terminal#zsh-linux).

``` bash
# Open settings JSON
"terminal.integrated.cursorStyle": "line",
"terminal.integrated.fontFamily": "Source Code Pro Medium",
"terminal.integrated.fontSize": 18

# on MacOSX
"terminal.integrated.fontFamily": "Source Code Pro for Powerline",
"terminal.integrated.fontSize": 16
```

### Open Terminal window in the split screen mode

If you wanna open terminal below the 2nd screen in the vertical split screen mode, you can: [[Cmd]] (or [[Ctrl]] on Windows/Linux) + [[Shift]] + [[P]] to open Command Palette > search for "*Terminal: Move Terminal into Editor Area*".

## Hot keys

One can change the default keyboard shortcut by going to: **File** > **Preferences** > **Keyboard Shortcuts**.

- Quick search file: [[Ctrl]] + [[P]].
- Get back to previous views: [[Ctrl]] + [[Alt]] + [[-]] (Linux), [[Alt]] + [[<]] (Windows), [[Ctrl]] + [[-]] (MacOS).
- Get forward: [[Ctrl]] + [[Shift]] + [[-]] (Linux), [[Alt]] + [[>]] (Windows), [[Ctrl]] + [[Shift]] + [[-]] (MacOS).
- **Open Command Palette**: [[Ctrl]] + [[Shift]] + [[P]].
- Go to line: [[Ctrl]] + [[Shift]] + [[P]] then _Go to line_.
- **Format document**:
  - Format entire doc: (Win/Linux) [[Ctrl]] + [[Shift]] + [[I]]; (Mac) [[shift]] + [[option]] + [[F]].
  - Format selected text: (Win/Linux) [[Ctrl]] + [[K]] then [[K]] + [[F]]; (Mac) [[cmd]] + [[K]] then [[cmd]] + [[F]].
- Quickly move a line up/down: [[Alt]] + [[up]] / [[down]] (Mac).
- Quickly duplicate current line: [[Shift]] + [[Alt]] + [[down]] (Mac).
- **Fold**: 👉 Using [something like](https://code.visualstudio.com/docs/editor/codebasics#_folding) `//#region ... //#endregion` for a region.
  - Fold all: [[cmd]] + [[K]] then [[cmd]] + [[0]].
  - Fold level 2: [[cmd]] + [[K]] then [[cmd]] + [[2]].
  - Unfold all: [[cmd]] + [[K]] then [[cmd]] + [[J]].
  - Toggle fold at the current position of the cursor: [[cmd]] + [[K]] then [[cmd]] + [[L]].
  - Toggle all `#region`: [[cmd]] + [[K]] then [[cmd]] + [[8]] (close) / [[9]] (open)
- Show all references: [[shift]] + [[option]] + [[F12]]