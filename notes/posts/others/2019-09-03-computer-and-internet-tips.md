---
layout: post
title: "Computer & Internet tips"
tags: [Others, Collection]
toc: false
icon: tips.svg
notfull: 1
keywords: "download flash video browser extension video url google video download manager videoplay developer tools exclude files folders search technique skills patterns preference settings confige configure options remove apps google apps bit.ly cortana uses chrome instead of edge default browser windows 10 change default directory powershell cmder github readme localhost split mp3 audio audacity youtube video tracks brave cursor shortcut chromium base inspect elements developer tools keyboards"
date: 2021-11-20
---

{% assign img-url = '/img/post/others' %}



::: hsbox Keep light mode for Chrome on MacOS

Using below command and don't forget to restart Chrome.

```bash
defaults write com.google.Chrome NSRequiresAquaSystemAppearance -bool YES
```

:::



::: hsbox Change keyboard shortcut for Dev Tools of Chromium browsers

We cannot change directly in the browser.

- **Native**: In the *Settings* page of Dev Tools, click on "*Experiments*", search for "key" and tick "Enable keyboard shortcut editor". Reload the Dev Tools and click on "*Shortcuts*", you will see the edit button on right of each shortcut.

- (Another way) **On Mac**, we can add the custom by going to *System Preferences* > *Keyboard* > *App Shortcuts* > "+" > Choose the app (eg. "Google Chrome.app") > Type **exactly** the name of commands, eg "Inspect elements".

:::



::: hsbox Connect localhost of another computer from this computer

On the "host" computer, use `ifconfig` (linux, macos) or `ipconfig` (windows) to know the ip address (something like `192.168.1.109`). From the "client" computer, browser `http://192.168.1.109:4000` (make sure on the "host", `localhost:4000` is working).

:::

::: hsbox Change default directory in [cmder](https://cmder.net/)
1. Go to settings

2. Then, Startup > Tasks

3. Choose `{cmd::Cmder}`

4. Choose the below-right box, let the cursor at the end of the text

5. Click on "Startup dir…"

6. Choose your desired directory > OK

7. Remove the current line with the new appearing one (`new_console:d:%USERPROFILE%`)

8. Click on Save settings

:::

::: hsbox Disable navigation by cursor on Brave (cursor showing up in the window at all times)
Toggle [[F7]].
:::


::: hsbox Cortana uses Chrome instead of Edge
- Download and install [this app](https://github.com/da2x/EdgeDeflector/releases) (reinstall it after every update of Windows).
- Choose **EdgeDeflector** as the default web browser if it asks.
- Install [this extension](https://chrome.google.com/webstore/detail/chrometana-redirect-bing/) in Chrome to force to redirect from **Bing** to **Google Search Engine**.

:::


::: hsbox Change default directory in PowerShell
- Create a folder in your **Documents** folder called **WindowsPowerShell**
- Create a file called `profile.ps1` inside this folder
- Add following command `Set-Location c:\abc`
- Every time you launch PowerShell, the profile script will be executed
:::

::: hsbox  Remove apps permission from Google Apps (Youtube, Google Play Music, …)
[Go here](https://myaccount.google.com/permissions)
:::


::: hsbox Problem of hsts
Cannot open a page with security problem.

1. Go to [chrome://net-internals/#hsts](chrome://net-internals/#hsts)
2. "Query HSTS/PKP domain", fill domain, e.g. `gitlab.powerop.io`.
3. "Delete domain security policies", fill domain and click on __Delete__.
4. Try again > Click on "Advanced" > Click on ...unsafe....

:::

::: hsbox Download flash video
In most case, you can use [Flash Video Downloader](https://chrome.google.com/webstore/detail/flash-video-downloader/aiimdkdngfcipjohbjenkahhlhccpdbc?hl=en) (for Chrome) or other extensions to detect the video url.

In the case browser extensions cannot capture the url, you can open the **Developer Tools** (in Chrome, press <kbd>F12</kbd>) > Reload the page and click to play again the video > **Network** tab > **Media** tab > click on any sources on the left column (`videoplayback?expire...`) > On the right column, in tab **Headers** > **General** > Copy the content in **Request URL**, something like below,

~~~ bash
https://r4---sn-25ge7ns7.googlevideo.com/videoplayback?expire=1568040368&ei=kEl2Xb...f_cW7qE=
~~~

Open a new tab in your browser, <kbd>Ctrl</kbd> + <kbd>S</kbd> to save the video. You can also open the Downloads manager in your browser (<kbd>Ctrl</kbd> + <kbd>J</kbd>) to copy the download link and use other Download Manager tools to download this video without using the browser!
:::

::: hsbox Github README on localhost
In stall [grip](https://github.com/joeyespo/grip).

``` bash
# go to the file's directory
grip # if file is README.md
grip file.md
```
:::

::: hsbox Split mp3 audio into tracks
It's useful if you [download mp3 audio from a youtube video](https://y2mate.guru/en8/).

1. Download & Install [Audacity](https://www.audacityteam.org/download/) (free, available for macos, linux, windows).
2. Check [this official manual](https://manual.audacityteam.org/man/splitting_a_recording_into_separate_tracks.html). Shortly,
   1. Select start and end (type number) at the sectio below "Start and End of Selection".
   2. Using [[cmd]] + [[B]] to "Add label at selection"
   3. Name for labels: Whenever a label is created, a small rectangle box appear next to the label point, click there to name the label.
   4. After adding all necessary labels, File > Export > Export Multiple > Split file based on "Labels" (tick on "Include audio before the first label) > "Name file" (should choose "Using Label/Track Name") option and then "Export".

:::