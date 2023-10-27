---
layout: post
title: "Web Design discrete note"
tags: [Web Dev]
toc: true
icon: "web-design.svg"
notfull: 1
lowQuality: 1
keywords: "autofocus separated columns page load google webfont sass Font ligatures terms two 2 columns list Font ligatures auto convert symbol focus on input field google webfont helper regex regular expression font download media bootstrap doesn't work create and combine svg icons"
date: 2021-11-21
---

{% assign img-url = '/img/post/web-dev' %}

## Create and combine svg icons

Combine 2 icons into one and generate a svg file. Eg. Combine "data" icon and "robot" icon into "data bot" icon.

1. Find svg icons using these pages: [icomoon](https://icomoon.io/), [flaticon](https://www.flaticon.com/),... Down as `.svg` format. You should choose icons with single color.
2. Using [mediamodifier.com](https://mediamodifier.com/design-editor) to combine them. Then download as `.jpg` files. Yep, with free account, you can only download this type of file.
3. Using [remove.bg](https://www.remove.bg/) to remove background and then save a new file in `.png` format.
4. Using pngtosvg.com to convert to `.svg` file. Don't forget to reduce the number of color to 1 before clicking "Generate".
5. Using [Icomoon to centralize the svg paths](/centralize-path-inside-svg-images/).
6. Finally, download you desired svg icon.

## Get rid of extra space: `svg` in `div`

```html
<div>
  <svg style="display: block;" height="100" width="100"></svg>
</div>
```

Inline-block elements (like `svg`, `img`) sit on the text baseline. The extra space is for character descenders (eg. the tail of "y", "g",...) => We can use `verticle-align: top` if we wanna keep it `inline` or `inline-block`.

## Terms

- **Font ligatures**: When you type <kbd>=</kbd> + <kbd>></kbd>, it becomes `⇒`.

## Verticle align fontawesome icon and text

👇 [Source](https://stackoverflow.com/a/18582808/1323473).

::: col-2-equal
```html
<div>
  <i id="icon" class="far fa-copy"></i>
  <span id="text">Text</span>
</div>
```

```css
div {
  display: inline-block;
  height: 1rem;
}
#text, #ico {
  line-height: 1rem;
}
#ico {
  vertical-align: middle;
}
```
:::

## Auto focus on an input field when page loads

Just add `autofocus` into the `<input>` tag.

~~~ html
<input name="q" class="search" type="search" placeholder="..." autofocus>
~~~

## Separate a list into 2 columns

And make it into 1 if the screen is small.

<div class="col-2-equal">

~~~ html
<div class="two-columns-list">
  <ul>
    <li></li>
  </ul>
</div>
~~~

~~~ scss
.two-columns-list {
  @media (min-width: $grid-md) {
    @include column-count(2);
    & > li {
      padding-right: 10px;
    }
  }
}
~~~
</div>

## `@media` not working

When I use bootstrap, the `@media` is not working when I change to mobile use, try to add below line to `<head>`,

``` html
<meta name="viewport" content="width=device-width" />
```


## Useful URLs

- **Sia Karamalegos** -- [Making Google Fonts Faster](https://medium.com/clio-calliope/making-google-fonts-faster-aadf3c02a36d).
- **The SASS way** -- [If-For-Each-While in SCSS](http://thesassway.com/intermediate/if-for-each-while).