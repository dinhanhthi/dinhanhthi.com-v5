---
layout: post
title: "Python sys & os"
tags: [Python]
toc: true
icon: "/img/header/sys.svg"
notfull: 1
keywords: "list all files in a directory add path"
---

## Libraries

~~~ python
import os, sys
import shutil
~~~

## Copy and move

``` python
shutil.copy('/Users/a/file.txt', '/Users/b/file.txt')
```

``` python
# Move a file from /Users/a/file.txt to /Users/b/
# (cannot replace)
shutil.move('/Users/a/file.txt', '/Users/b/')

# Move and replace
shutil.move('/Users/a/file.txt', '/Users/b/file.txt')
```

## Append path to the environnement

~~~ python
sys.path.append('../') # the path of current file's father
~~~

## Get files' info

``` python
# Find location first and then get the path
file = 'abc.xyz'
for root, _, files in os.walk(r'D:\python'):
    for name in files:
        if name == file:
            print (os.path.abspath(os.path.join(root, name)))
```

``` python
# Get current working directory

# We're in /home/thi/
print(os.getcwd()) # in /home/thi/scripts/helper.py
py scripts/helper.py # returns: /home/thi

# We're in /home/thi/
print(os.path.dirname(__file__)) # in /home/thi/scripts/helper.py
py scripts/helper.py # returns: /home/thi/scripts

os.path.dirname(__file__) # returns: /home/thi/scripts/helper.py

# NOTE: We have to call a file to make "__file__" work!

# We can use in a jupyter notebook
from helper import test
# test = os.path.dirname(__file__)
```

::: col-2-equal
~~~ python
# List of all files in a path
file_path = '.' # current dir
os.listdir(file_path)
~~~

~~~ python
# The last modification
os.path.getmtime(<full-path-to-file-name>)
~~~
:::