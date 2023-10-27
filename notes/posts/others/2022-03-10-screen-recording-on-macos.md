---
layout: post
title: "Screen recording with system sound on MacOS"
tags: [Others, MacOS]
icon: macos.svg
keywords: "macbook macos mac osx screen recording audio system audio microphone airphone call skype meet capture"
---

It's complicated than I think, so I make a separated note for this.

👉 Note: [Fresh MacOS installation](/fresh-install-macos/).

## Using Screenflick

**My choice**: using [Screenflick](https://www.araelium.com/screenflick-mac-screen-recorder) (paid, 35$).

::: warning

❗ Should test the number of frame rate before recording. I've tried, **20 didn't work**!!! ==I use **30 fps**==!

:::

**Requirements:**

1. All Screenflick's requirements for system access.
2. Tick "*Record System Audio*" and "*Record Microphone*". Choose the right microphone you are using (eg. Airpod)

If you are alredy in the call (with Meet, for example) or not, just follow:

1. Click record button > choose screen > Make sure that **the screen are being recorded...**
2. On Meet (or other application) > go to Setting > Change the output sound to "Screenflick Loopback", **you should still hear the system sound normally!!**. An important note, ==**don't choose this setting before clicking the record button**==, otherwise, you won't hear anything from the system sound.
3. Click on the screenflick icon on the menu bar to make sure that the audio is well recorded (alongside with the microphone). There will be 2 bar indicating the recording process.

If you aren't in any meeting application, for example, you wanna record the sound from Youtube. Don't need to change anything, **just choose the right devices and record**! For example, I use Airphone, so I choose output and input to be Airpod.



## Others

- Using **QuickTime** / built-in function. Open QuickTime or [[⌘]] + [[⇧]] + [[5]] to open screenshot/recording options. **Weakness**: big size + impossible (or possible??) to record system sounds.
- Using [OBS](https://obsproject.com/) (Free, suitable for streaming) (for recording app) + [BlackHole](https://github.com/ExistentialAudio/BlackHole) (for bypassing system audio recorder, I chose **2ch** to download).
  1. Check [this article](https://obsproject.com/forum/resources/os-x-capture-audio-with-ishowu-audio-capture.505/) for setting up with OBS (not that, in this article, they use a different tool than BlackHold)
  2. Check [this article](https://streamlabs.com/content-hub/post/capturing-desktop-audio-in-streamlabs-obs-for-mac) for using BlackHole to capture system audio on Mac.
  3. Open **Audio MIDI Setup** > Click on "+" > "Create Multi-Output Device" > Check on (Use side) current using Speaker (ex. External Headphones) + BlackHole 2ch. Check also (Drift Correction) for "External Headphones". Rename to something to remember, e.g. "Screen Recorder". We wanna listen the system audio via 2 output, one is external heaphones, 1 is "virtual" BlackHole (so that it can recorder the sound).
  4. Open **Sound** setting and choose "Screen Recorder". **Tip**: you should adjust the sound before change to "Screen Recorder" because you will not be able to change sound level in this option.
  5. In **OBS**, Add screen, add 2 microphones, one for real mic, one for device BlackHole 2ch.
     1. Open Preferences > Audio: Mic/Aux 1, choose "External microphone", Mic/Aux 2, choose "BlackHole 2ch" > OK.
  6. Some settings for OBS:
     1. Turn off preview for screen (for comfortable)
     2. **Video** > Common FPS Values = 20

