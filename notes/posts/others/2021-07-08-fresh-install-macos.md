---
layout: post
title: "Fresh MacOS installation"
tags: [Others, Fresh Installation, MacOS, Collection]
toc: true
icon: macos.svg
keywords: "install new macbook setting up applications command line zsh terminal nodejs python brew shortcut cask nodejs node zsh oh-my-zsh xcode bitwarden XCodes dark mode canon printer mg2900"
date: 2023-04-29
---

This is my personal list of to-do things for a new Macbook.

👉 Note: [Ubuntu / Pop!\_OS fresh start](/fresh-installation-ubuntu/).
👉 Note: [Windows fresh start](/fresh-install-windows/).
👉 Note: [DS & ML with Mac M1](/getting-start-data-science-machine-learning-on-mac-m1/).

## **Check info**:

```bash
# Current version of MacOSX
sw_vers -productVersion

# Check if XCode Command Line Tools is installed
xcode-select --install
# Should return "/usr/bin/xcrun"
# If there is any problem, try to install XCode from App Store!

# check if running on ARM or Intel
arch
# arm64 -> ARM
# i386 -> Intel (running with Rosetta)
```

## **Keyboard & Trackpad settings**

Go to **Keyboard Settings** and then,

1. Should choose "U.S." instead of "U.S. International" because with the latter, we have underline score below special symbols like `"`
2. For Vietnamese input method, DON'T choose built-in VNese input options. Use ~~[GoTiengViet](https://www.trankynam.com/gotv/)~~ [EVKey](https://evkeyvn.com/) instead (Turn off _Gatekeeper_ before installing by `sudo spctl --master-disable`. Then check by `spctl --status` => should return `assessments disabled`)! (Because there will be unconfortable underline when we type).
   1. **Note 1**: If you are going to use Bitwarden (a password manager, recommended), it will prevent sometimes the input method to work normally (including GoTiengViet and EVKey). In this case, you have to turn off Bitwarden (or restart it). 👉 **Update 05 Nov 2021**: With MacOS 12.1 Beta, it doesn't have this error anymore!
   2. **Note 2**: EVKey works better than GoTiengViet (and it's still maintained) in some cases, for example, when you wanna type "thử nghiệm" on the browser address bar, GoTiengViet gives "thuử nghiệm" instead.

### **More keyboard settings**:

1. Touch Bar shows: **F1, F2, etc Keys**.
2. Press ... to: **Do Nothing**.
3. Press and hold ... to: **Show Control Srip**.
4. Tick on "Use F1, F2..."
5. Click on **Customize Control Strip** and change. Below are my customization.

   ```bash
   Brightness - Keyboard Brightness -- Media -- Volume -- Screen Lock -- Night Shift -- Screen Capture -- Dictation -- Siri
   ```

### Other useful keyboard tips

1. Map top-left keyboard to backslash/tilde symbols. Install [Karabiner-Elements](https://karabiner-elements.pqrs.org/) and setting up "non_us_backslash" to "grave_accent_and_tilde (`)". If you don't know the names of some keys, you can use installed Karabiner Viewer.

2. Three fingers to drag (choose texts): **System Preferences** > **Accessibility** > **Pointer Control** > **Trackpad Options...** > Enable dragging (three fingers drag).

3. Install ~~[AltTab](https://alt-tab-macos.netlify.app/)~~ [HyperSwitch](https://bahoom.com/hyperswitch) (and use [[⌘]] + [[⇥]] which replaces the default method on mac, be careful!!!) to switch between windows (instead of apps) like on Windows/Linux.

    ::: hsbox More settings of AltTab

    Open its preferences (We wanna show windows only on the screen containing the cursor):

    - General > tick on "Start at login".
    - Controls > Show windows from: "Screen showing AltTab" (on the 3rd option).
    - Appearance > Show on "Screen including mouse".

    :::

4. **For external keyboard K380**: Download and install [Logitech Options](https://www.logitech.com/en-us/product/options). Install this to use [[F]] keys by default. **Remark**: Don't open Bitwarden while using K380, otherwise, it won't work normally (for example, F keys).

## **Printers & Scanners**

1. Setting up **printers** (if available). You may need [Gutenprint](http://gimp-print.sourceforge.net/MacOSX.php) for an alternative driver for printers on chip M1. After installing the drivers, turn on your printer (connect to a common wifi or via an usb cable), then _System Preferences_ > _Printers & Scanners_ > Add printer and choose your own printer, don't forget to choose Gutenprint as driver!
2. For **scanner** app: you can use VueScan (paid) if the current version of app doesn't support chip M1 yet!
3. For **Canon MG2900** printer/scanner + apps: you may need to download and install drivers from [this site](https://brothersupportdownloads.blogspot.com/2020/06/canon-pixma-mg2900-scanner-driver.html). A backup files are [here](https://mega.nz/file/U0RwBR6T#qa50uOyhlAEiRtrMm_zBkXPtPufJD2Wa1gtbtkw5W_w). You may find other useful drivers for other types of printers on this site also.
   - Change to use black & white only (or color only): System Preferences > Printers & Scanners > Choose the printer > Options & Supplies > Utility > Open Printer Utility > Ink Cartridge Settings > Black Only.
4. **Scanner app**: use **Image Capture** (built-in app on Mac) or install **Canon IJ Scan Utility2**.

## **Finder**

1. Add necessary folder shortcuts to sidebar.
2. Add recycle Bin to sidebar: [[⇧]] + [[⌘]] + [[.]] to show hidden folders > drag **Bin** folder to sidebar > [[⇧]] + [[⌘]] + [[.]] to hide hidden folders again.
3. Customize some options in Preferences.
4. Show status bar: View > Show status bar.

### Copy files between Linux and MacOS

**Require**: the same wifi network!

1. **On MacOS**: System Preferences > Sharing > Tick on "File Sharing" > choose "Shared Folders" > on "Everyon", change to "Write & Read".
2. **On Linux**: Nautilus, click on "Other Locations" > "Networks" > choose the Macbook (and type macos profile password) > choose the shared folders in previous step > Exchange files/folders you want.

Disable Resume in Preview and QuickTime Player

```bash
defaults write com.apple.Preview NSQuitAlwaysKeepsWindows -bool false
defaults write com.apple.QuickTimePlayerX NSQuitAlwaysKeepsWindows -bool false
```

## **Screen recording**

👉 Note: [Screen recording on MacOS](/screen-recording-on-macos/).

For creating a gif, use GIPHY Capture (download from App Store).

## **Dictionary**

- [Install Viettien](https://mega.nz/file/x0RgTbhK#1rz1mpsbXXxLmLs1blVk9zLEmI0d5FXk7Bora4Rm9Y0) (I use version 5.0b for Mac Big Sur chip M1). Alternative dictionaries can be downloaded from this link (I backed it up for personally using).
  1. Don't forget to open **Security & Privacy** and click on **Open anyway** many times!
  2. Another option is to install Tinhte's dictionary from this link, copy extracted folder (`Tinhe_anh-viet.dictionary`) to `/Users/thi/Library/Dictionaries/`.
  3. After installing successfully, open Dictionary app > Preferences... > Tick on the names which are corresponding to the installed/copied dictionaries.
  4. There are built-in LacViet dictionaries but they are not activated yet, don't forget them!
- **Goldendict**: download installation [here](https://github.com/goldendict/goldendict/wiki/Early-Access-Builds-for-Mac-OS-X) + dictionaries [here](https://drive.google.com/drive/folders/1jna8_grA-wyhPrq8BiB7ypadvW3tTlIv).

## Applications

### **External apps**

::: hsbox Show the list

- [AppCleaner](https://freemacsoft.net/appcleaner/) -- uninstaller.
- [Authy](https://authy.com/) -- Two factor authentication (Yes, use it instead of Google Authenticator or others!)
- (Optional) [balenaEtcher](https://www.balena.io/etcher/) -- Flash OS images to SD cards & USB drives, safely and easily. In case you wanna make a bootable USB to install other OS.
- [Bartender 4](https://www.macbartender.com/Bartender4/) (paid, 15.37$) -- hide some icons on menu bar. 💡 **Tip**: You can try the trial version and then click "Remind me later" and keep using the trial version without purchasing it.
- [CleanMyMac](https://macpaw.com/cleanmymac) (paid) -- uninstaller + optimize your mac. **An alternative**: [BuhoCleaner](https://www.drbuho.com/) (free version is almost enough).
- **Communication**: [Skype](https://www.skype.com/en/get-skype/), [Zoom](https://zoom.us/download), [Slack](https://slack.com/intl/en-fr/downloads/mac).
- [Docker](https://docs.docker.com/docker-for-mac/apple-m1/)
- ~~[Dropbox](https://www.dropbox.com/downloading). We can "quit" the app on dock, the icon on menu still there!~~ [Google Drive](https://www.google.com/drive/download/) -- sync personal data files.
- [EVKey](https://github.com/lamquangminh/EVKey) -- Vietnamese Input Method. **Note**: Don't use it with Bitwarden (a password manager).
- [GitKraken](https://www.gitkraken.com/) + sign in + clone some repos. Check [this note](/gitkraken/).
- ~~[Google Chrome](https://www.google.com/chrome/) and sign in to sync~~. **I'm using [Brave](https://brave.com/)** (chromium-based engine also)
  1. Disable Tab Hover Cards: navigate to `chrome://flags/`, search for "tab hover" and choose "Disable".
  2. Add a site to use cookies (enable third-party cookies for downloading files on Google Drive): Go to `chrome://settings/cookies` and then "Add" `drive.google.com` (tick on third-party...) in "Sites that can always use cookies" section.
  3. **Custom keyboard shortcut**: System Preferences > Keyboard > Shortcuts > Application Shortcuts > "+" > Choose Brave > Type the name EXACTLY THE SAME as the name in menu (for example "Inspect elements") > Add a custom shortcut. **Pro tip**: In order to find the name of the action, you can use Search Help (either click "Help" in the menu bar or press [[cmd]] + [[shift]] + [[/]])
  4. Use `defaults write com.google.Chrome NSRequiresAquaSystemAppearance -bool YES` to force Chrome to use light mode.
  5. **Cannot share screen with Chrome** (eg. in Google Meet): follow [this guide](https://apple.stackexchange.com/a/438636).
- [iTerm2](https://iterm2.com/) (check more in other section). This is for a sticky terminal (after some configs). An alternative which is really beautiful is [Hyper](https://hyper.is/).
- [Itsycal](https://www.mowglii.com/itsycal/) -- a dropdown calendar with agenda. After installing, you have to choose manually the agenda profiles you wanna show.
- [Mojibar](https://github.com/muan/mojibar) - emoji indicator on menu bar. Install via `brew install mojibar`. Using [[⌃]] + [[⇧]] + [[⎵]] to open the window. A paid option is [Mumu](https://getmumu.com/) (20$). After install, press [[cmd]] + [[,]] to open preferences and then choose Skin tone to "None" (for me only).
- [Molotov](https://www.molotov.tv/download) -- watch French TV online.
- [MusicBrainz Picard](https://picard.musicbrainz.org/) - Free music tag editor.
- ~~[Paragon NTFS](https://www.paragon-software.com/home/ntfs-mac/) (paid, 20$)~~ [Mounty](https://mounty.app/) (no need to restart) -- Do everything with Windows drives on your Mac.
  - Another option: you can buy an OTG (On-The-go) adapter and connect the external drive using it without any problem. I used [Urgreen's](https://www.amazon.fr/gp/product/B072V9CNTK).
  - In case you wanna format an USB drive as NTFS, 1st, install the (open-source) [NTFS driver - ntfs-3g](https://github.com/tuxera/ntfs-3g).
- [Paintbrush](https://paintbrush.sourceforge.io/) -- a "Paint like" for macOS. A simple image editor for macOS.
- **[New]** [PlayCover](https://www.playcover.me/) -- Run iOS apps & games. Fullscreen mode. Mouse, keyboard and controller support.
- [Qbserve](https://qotoqot.com/qbserve/) (paid, 15 days trial) -- Activities tracker for MacOS. Record all of your activities on your Mac (and show in real time on menu bar) your productivity. I chose it because I can buy it forever without subscription and satisfies with its simple UI.
- [qView](https://interversehq.com/qview/download/) -- cross platform photo viewer (continuously view photos in the same folder + simple viewer + no open old files,...)
- [Raindrop](https://raindrop.io/download) -- bookmark manager.
- [SelfControl](https://selfcontrolapp.com/) -- A free Mac application to help you avoid distracting websites. **Tip**: It seems that impossible to disable until the time is over, however, just change the system date and you are able to reset the timer.
- [TeamViewer](https://www.teamviewer.com/en/download/mac-os/) -- remote control.
- [Transmission](https://transmissionbt.com/) -- torrent client.
- ~~[uBar](https://brawersoftware.com/products/ubar) (paid) -- disable default dock and make a windows-like taskbar. **Be careful**, it takes too much RAM!~~
- ~~[VLC Player](https://www.videolan.org/vlc/download-macosx.html)~~ -- video player. [IINA player](https://iina.io/) -- The modern media player for MacOS.
- [VSCode](https://code.visualstudio.com/download) + sign in to sync using Github account.
- [XDM Download Manager](https://sourceforge.net/projects/xdman/files/XDMSetup.dmg/download). [An alternative way](https://brewinstall.org/install-xtreme-download-manager-mac-osx/) to install it via brew.
- [Youtube Music App](https://ytmusic.app/) for Mac (unofficial)
- ~~[XtraFinder](https://www.trankynam.com/xtrafinder/) (additional settings for Finder)~~

:::

### **Appstore**

::: hsbox Show the list

- **Amphetamine** -- Keep-awake your mac, an alternative to caffein on linux.
- **Bitwarden** -- need to install desktop application to enable fingerprint unlock for browser extension. Restart both application and follow the instruction on extension to enable this feature.
- **Communication**: Whatsapp Desktop + Messenger App.
- **DictBox** -- dictionary.
- **GIPHY Capture** -- screen record as a gif.
- **Horo** -- Timer for Mac.
- **Magnet** -- arrange window workspace (stick to edge like on Windows).
- **[Mini Time Tracker](https://menegay.org/mini-time-tracker/)** -- Minimalistic menubar stopwatch.
- **Skitch** -- annotation for photos on Mac.
- **TaskTab** -- List of tasks right on menu bar.
- **TickTick** -- task manager.
- **Tile Photo FX - Slice & Puzzle** -- Add grid to photos.
- **The Unarchiver**
- **Word** and **Powerpoint** (in Office 365 suit, paid). You can buy a lifetime license on ebay (not your own email but you can integrate yours later).
- **Yomu** -- ebook reader.
- **Vectornator** -- illustration, vector graphic design. A free alternative to Adobe Illustrator or Affinity Designer.

:::

## **Terminal**

- (For chip M1 only)

  ```bash
  # check if running on ARM or Intel
  arch
  # arm64 -> ARM
  # i386 -> Intel (running with Rosetta)

  # Clone Terminal.app
  sudo cp -r /System/Applications/Utilities/Terminal.app /Applications/Terminal-Rosetta.app
  ```

  Right click on Terminal-Rosetta.app > Get Info > Click on "Open using Rosetta". - If you wanna run commands in Intel environment, use **Terminal-Rosseta**. - If you wanna run commands in ARM environment, use **Terminal.app**.

- Dropdown terminal with **iTerm2**.
  1. Create a new profile and make it default. Download my customized profile [here](https://github.com/dinhanhthi/scripts/blob/master/settings/macos/DropDown.json).
  2. Click on new profile > Keys > Tick on "A hotkey..." > Set [[⌘]] + [[`]] for opening window.
  3. For "non profile settings": Keep default with,
     1. General > Window: Tick on "Smart...".
     2. Appearance > general > Tab bar location: bottom.
     3. Advanced: search "animation" > Hotkey: 0.05;
  4. Custom name of pane: Right click on the pane > _Edit Session..._ > Tab _General_ > Change the name in _Session Name_ (eg. "WORKING") (also click on the "lock" icon on the right) > _Session Title_ ONLY tick on "Session Name".
- **Zsh terminal**: 👉 Note: [Terminal](/terminal/).

  ::: hsbox Code

  ```bash
  # By default, iTerm2 comes with pre-installed zsh
  # You can check current shell
  echo $SHELL # should returns /bin/zsh
  # Check zsh version
  zsh --version
  
  # install oh-my-zsh
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
  
  # install spaceship theme
  git clone https://github.com/denysdovhan/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt"
  ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
  # Make spaceship as default
  # Set ZSH_THEME="spaceship" in your .zshrc.
  # Follow this (optional): https://gist.github.com/kevin-smets/8568070
  # Download (then open and install) font Source Code Pro:
  # https://github.com/powerline/fonts/blob/master/SourceCodePro/Source%20Code%20Pro%20for%20Powerline.otf
  # Open iTerm2 Preferences > Profile > Text > change font!
  
  # If you wanna see the changes
  source ~/.zshrc
  ```

  :::

## Macbook keyboard symbols

::: hsbox ALl symbols

```bash
HTML Entity     GLYPH  NAME
&#63743;              Apple
&#8984;         ⌘      Command, Cmd, Clover, (formerly) Apple
&#8963;         ⌃      Control, Ctl, Ctrl
&#8997;         ⌥      Option, Opt, (Windows) Alt
&#8679;         ⇧      Shift
&#8682;         ⇪      Caps lock
&#9167;         ⏏      Eject
&#8617;         ↩      Return, Carriage Return
&#8629; &crarr; ↵      Return, Carriage Return
&#9166;         ⏎      Return, Carriage Return
&#8996;         ⌤      Enter
&#9003;         ⌫      Delete, Backspace
&#8998;         ⌦      Forward Delete
&#9099;         ⎋      Escape, Esc
&#8594; &rarr;  →      Right arrow
&#8592; &larr;  ←      Left arrow
&#8593; &uarr;  ↑      Up arrow
&#8595; &darr;  ↓      Down arrow
&#8670;         ⇞      Page Up, PgUp
&#8671;         ⇟      Page Down, PgDn
&#8598;         ↖      Home
&#8600;         ↘      End
&#8999;         ⌧      Clear
&#8677;         ⇥      Tab, Tab Right, Horizontal Tab
&#8676;         ⇤      Shift Tab, Tab Left, Back-tab
&#9250;         ␢      Space, Blank
&#9251;         ⎵      Space, Blank
```

:::

## 🐞 **Errors**

1. After updating

    ```bash
    defaults write com.apple.dock persistent-apps -array-add '{"tile-type"="spacer-tile";}'; killall Dock
    ```

    Need to update _Xcode Command-line Tools_:

    ```bash
    # option 1
    xcode-select --install
    # output:
    xcode-select: note: install requested for command line developer tools
    ```

    ```bash
    # option 2 (if option 1 doesn't work)
    # Login + download from webpage
    https://developer.apple.com/download/more/
    ```

2. In case of error in installing Application with `App is Damaged Can’t Be Opened`

    ```bash
    xattr -cr /Applications/App_Name.app
    ```

### Sidecar problems

Using Sidecar feature to turn your ipad to an external screen. It ==works normally with cable== (you have to "trust" from both sides each other). In the case you **cannot use Sidecar via wireless**,

1. Turn on Hardoff on both Mac (in General) and iPad (in General).
2. Turn on Bluetooth and Wifi (connect to the same network).
3. Turn off file sharing and VPN.
4. Reset network setting on your ipad (General > Reset > ...) > restat > connect again to the same network with your Mac > wait 2 minutes > try Sidecar again!
5. **Best practice**: Using sidecar via a usb cable! If using wifi, we have latency with mouse cursor!
6. For ones who using mac's usb-c port. A direct hub (with an lightning output to charge ipad) may not work (not sufficient power to charge ipad). However, usign another usb-dock and connect to the hub is working fine. Other words,
   - _Not working_: mac - hub - ipad.
   - _Working_: mac - hub - usb doc - ipad

### FTP connection problem

If you have any problem with the connection, like *The share does not exist on the server. Please check the share name, and then try again.*, make sure the password doesn't contain `@`! ([Source](https://apple.stackexchange.com/questions/110965/connect-to-ftp-server-in-finder-not-working))

## **External screens**

I use 2 external screens. However, chip Apple M1 doesn't support more than 1 external one. That's why we need an adapter (having DisplayLink technology) + to install DisplayLink driver for Mac.

- I use [this adapter](https://www.wavlink.com/en_us/product/WL-UG39DK1_White.html) (Wavlink's USB 3.0 Laptop Docking Station -- WL-UG39DK1) because it's the cheapest one I can find in France.
- [DisplayLink driver](https://www.displaylink.com/downloads/macos). Note that, sometimes it doesn't support the rotation screen.
- If you use a portable external screen like mine (Asus zenscreen), you have to use DisplayLink driver (and open it).

## Disable dark mode for specific app

```bash
# Use spotlight to find the name of the app, eg. "Calendar"
# Find the bundle identifier of this app by
osascript -e 'id of app "Calendar"'
# which returns: com.apple.iCal

# Turn off dark mode
defaults write com.apple.iCal NSRequiresAquaSystemAppearance -bool Yes
# Restore setting
defaults write com.apple.iCal NSRequiresAquaSystemAppearance -bool No

# Restart the app
```


## Other settings

1. Enable to install unknown softwares: Sometimes, you cannot install some app from the internet, just go to **System Preferences** > **Security & Privacy** > There will be some warning line at below of "App Store and identified developers", just click "Open anyway"!

   - If you have some issue with `.dmg` file like "resource busy", open **Disk Utility**, then **Images** > **Verify...** > Choose the image file you cannot open then click "Verify"!

2. **Git**: install Gitkraken.

3. (Optional) Install [Hombrew](https://brew.sh/) (missing package control for mac).

   ```bash
   # after install, don't forget to add to PATH
   echo 'eval $(/opt/homebrew/bin/brew shellenv)' >> /Users/thi/.zprofile
   eval $(/opt/homebrew/bin/brew shellenv) # refresh

   # problem with "old" cask
   # instead of
   brew cask something
   # use
   brew install --cask something
   ```

4. Add gap to Dock (use multiple times)

   ```bash
   defaults write com.apple.dock persistent-apps -array-add '{"tile-type"="spacer-tile";}'; killall Dock
   ```

5. Paste as plain text (Paste and match style) using [[cmd]] + [[shift]] + [[v]] (for example): System Preferences > Keyboard > Shortcuts > App Shortcuts > + (Add). Now you choose: all apps; menu title: Paste and Match Style; Keyboard Shortcut: [[cmd]] + [[shift]] + [[v]] (choose your own).

