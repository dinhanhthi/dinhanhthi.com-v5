---
layout: post
title: "Centralize paths of svg images"
tags: [Web Dev]
icon: "svg.svg"
keywords: "centralize svg images tool photo middle align web design css modify edit stroke to fill canvas center"
date: 2021-11-19
---

{% assign img-url = '/img/post/web-dev' %}

You can either using `<img>` or `svg` for inserting an svg photo to your website. If you wanna change the color using css (eg. `fill=`), you should use `svg`. However, the paths inside the `<svg>` aren't always centrally aligned.

We can use [IcoMoon App](https://icomoon.io/app/#/select) to do this.

1. You should create an IcoMoon account (not required but recommended).
2. Copy all the codes in `svg` image (open it with [VSCode](/visual-studio-code/), for example).
3. Click "Import Icons" and upload your svg images. **Tip**: You can drag and drop your file into IcoMoon. **Note**: If you meet some warning like "have to convert stroke to fill", you can use [this online tool](https://iconly.io/tools/svg-convert-stroke-to-fill).
4. Choose the pen icon (for editing)
5. Click on an imported icon, a modal appears.
6. Click on "Canvas/Alignment" tool > Choose "Square Canvas" then "Align to center".
7. Click on "Scale" > "Fit to Canvas".
8. Dowload you edited svg.
9. Open it with a text editor. Copy all the code inside and use it.

There are many other tools you can use for editing svg image. ==You can even create a font with your svg image==.