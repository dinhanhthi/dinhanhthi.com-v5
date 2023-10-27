---
layout: post
title: "Problem solving 1"
tags: [Algorithms, Problem Solving]
icon: /img/cats/algo.svg
toc: true
keywords: "chunker slide slicing rolling batches windows list sequence split imshow plot true false grid squares bernoulli distribution algorithm python"
notfull: true
---

{% assign img-url = '/img/post/algorithms' %}

This note contains questions/puzzle and algorithms to answer these problems. Most of the codes in this type of note are in [**Python**](/#python) or [**JS**](/#javascript).

## [Python] Count number of element in an array or properties of an object

For example,

```js
countTheNumberOfLines([1, [1]]) // returns 3
countTheNumberOfLines({"x": 1, "y": [1]}) // returns 3
```

```js
private countTheNumberOfLines(obj: any): number {
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      let count = obj.length;
      for (let i = 0; i < obj.length; i++) {
        count += countTheNumberOfLines(obj[i]);
      }
      return count;
    } else if (obj && typeof obj === 'object') {
      let count = Object.keys(obj).length;
      for (const key in obj) {
        if (typeof obj[key] !== 'function') {
          count += countTheNumberOfLines(obj[key]);
        }
      }
      return count;
    }
    return 0;
  }
  return 0;
}
```

## [Python] Make chunkers / windows

Split a sequence into windows with size and slide.

```python
def chunker(seq, size, slide=None, exact_size=False):
    if slide is None:
        slide = size
    if exact_size:
        return [seq[pos:pos + size] for pos in range(0, len(seq), slide) if len(seq[pos:pos + size]) == size]
    else:
        return [seq[pos:pos + size] for pos in range(0, len(seq), slide)]
```

::: code-output-flex

```python
seq = [i for i in range(10)]

chunker(seq, 3)
chunker(seq, 3, exact_size=True)
chunker(seq, 3, slide=2)
```

```
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

[[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]
[[0, 1, 2], [3, 4, 5], [6, 7, 8]]
[[0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 8], [8, 9]]
```

:::

Make all arrays equal in size, filled with `np.nan`,

```python
def chunker2(seq, size, slide=None):
    if slide is None:
        slide = size
    return [np.append( seq[pos:pos + size], np.repeat(np.nan, size-len(seq[pos:pos + size])) )
            for pos in range(0, len(seq), slide)]
```

::: code-output-flex

```python
seq = [i for i in range(10)]

chunker2(seq, size=4, slide=2)
```

```
[array([0., 1., 2., 3.]),
 array([2., 3., 4., 5.]),
 array([4., 5., 6., 7.]),
 array([6., 7., 8., 9.]),
 array([ 8.,  9., nan, nan])]
```

:::

## [Python] Plot a grid of squares

Plot a square of `NxN` small other squares. Each one has a probability `Pxi/N` of being coloured, where `i` is the line where it stands.

<div class="col-2-equal">

```python
N = 100
P = 0.5
im_size = 5

image = np.repeat(np.array(range(1,N+1)).reshape(N, 1), N, axis=1)

# LESS understandable but executing FASTER
image = (P/N * image) <= np.random.rand(N,N)

# MORE understandable but executing SLOWER
def bernoulli(num, P, N):
  return 1-np.random.binomial(1, P*num/N)
vfunc = np.vectorize(bernoulli)
image = vfunc(image, P, N)

plt.figure(figsize=(im_size, im_size))
plt.imshow(image, cmap='gray')
plt.show()
```

![Bernoulli squares]({{img-url}}/bernoulli-squares.png){:.img-full-90}

</div>

## [JS] Find and replace text with `span`

**Problem**: given a sentence and an array containing words and their colors to be replaced in the sentence.

::: hsbox An example of inputs and outputs

```js
const entities = [
  {
    "word": "test",
    "color": "blue",
  },
  {
    "word": "span",
    "color": "yellow",
  },
  {
    "word": "test",
    "color": "red",
  },
  {
    "word": "testing",
    "color": "white",
  },
  {
    "word": "span",
    "color": "black",
  }
];
```

```js
var text = "Test testing test span test span.";
```

What we expect,

``` js
'<span style="color: blue">test</span> <span style="color: white">testing</span> <span style="color: red">test</span> <span style="color: yellow">span</span> test <span style="color: black">span</span>.'
```

:::

::: hsbox Challenges

1. "test" is different from "testing".
2. There is "span" in the `entities` but there is also "span" in the replacement `<span style="...">`.
3. Two same words "test" in `entities` will be replaced in 2 first different "test" in `text`.

:::

::: hsbox Idea of the solution

What we need to find is the placement of found words in `text` when using `String.replace()`. For example, the color "red" of the second word "test" in `entities` should be used for the 2nd "test" in `text` (not "test" in "testing").

For ignoring the "test" in "testing", we use regex `\btest\b`.

A problem comes in is that there will be "span" of `<span style=...>` before we find and replace the text "span".

So, we have to determine from the beginning of the text, how many words have already been replaced (eg. it's 1 for the 2nd "test") and also how many words are added by the replacement (eg. it's 1 for "span" because after the first "test", there will be a "span" in `<span style=...>`).
:::

::: hsbox Codes

```js
let newText = text;
entities.forEach((entity, index) => {
  // Count occurances of the same entity.word in entities before this one
  const slice = entities.slice(0, index);
  let countInEntities = 0;
  slice.forEach(e => countInEntities += e.word === entity.word);

  const re = new RegExp(`\\b${entity.word.toLowerCase()}\\b`, 'gi');

  // Count in text without span
  const countInText = [...text.toLowerCase().matchAll(re)].length;

  // Count in new text
  const countInNewText = [...newText.toLowerCase().matchAll(re)].length;

	const whereToReplace = countInNewText - countInText + countInEntities + 1;

  let t = 0;
  newText = newText.replace(re, match =>
    ++t === whereToReplace
      ? `<span style="color: ${entity.color}">${zeroWidthSpace}${entity.word}</span>${zeroWidthSpace}`
      : match
  );
});
```

:::