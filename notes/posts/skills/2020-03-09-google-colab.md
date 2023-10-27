---
layout: post
title: "Google Colab"
tags: [API & Services, Google]
toc: true
icon: colab.png
keywords: "github notebook google drive hotkey TensorFlow pytorch gpu import library git with colab upload a file to colab 7zip zip graphviz pydot cartopy save as html keep google colab open awake prevent from disconnect re-install install packages"
date: 2022-07-06
---

{% assign img-url = '/img/post/skills' %}

## URLs

- [Main site](https://colab.research.google.com/).
- [Welcome site](https://colab.research.google.com/notebooks/welcome.ipynb?authuser=1).
- [SeedBank by Google](https://research.google.com/seedbank/): Collection of Interactive Machine Learning Examples.

## Colab & Github

👉 Check [this section](#clone-a-repo-from-github) too.

::: hsbox Open with Colab from Github URL
"*Open with Colab*" any Jupyter Notebook file (`.ipynb`) in Github. For example, the file's URL is:

~~~ bash
https://github.com/dinhanhthi/dataquest-aio/blob/master/file-name.ipynb
~~~

You can open with colab with the URL:

~~~ bash
https://colab.research.google.com/github/dinhanhthi/dataquest-aio/blob/master/file-name.ipynb
~~~
:::

::: hsbox In the case you wanna import dataset (`.csv`) from Github.

First, open this `.csv` file as RAW. Its URL may be

~~~ bash
https://raw.githubusercontent.com/dinhanhthi/dataquest-aio/master/file.csv
~~~

and then use it as the url of the data file. Note that, you cannot use `open` to read this file,

~~~ python
import csv

# We can use on localhost
opened_file = open(dataset_url, encoding="utf8")
read_file = csv.reader(opened_file)

# But we CAN'T use this `open` for the link from Github, we use:
from urllib.request import urlopen
opened_file = urlopen(dataset_url).read().decode('utf-8')
read_file = csv.reader(opened_file.splitlines())
~~~

:::

::: hsbox Save a notebook to Github

For example, I wanna save current notebook (eg. `abc.ipynb` to repository `data-science-learning/playground`).

From the notebook, **File** > **Save a copy in Github** > Choose a repository > Type `playground/` before *File path* > OK.

:::

## Hotkeys / Shortcuts

Check the command shortcuts in **Tools** > **Keyboard shortcuts** (<kbd>Ctrl</kbd> + <kbd>M</kbd> <kbd>H</kbd>), below are the most popular ones (If you use MacOS, replace [[Ctrl]] with [[cmd]]):

::: hsbox Show the list

- <kbd>Ctrl</kbd> + <kbd>S</kbd>: **save** the notebook.
- <kbd>Ctrl</kbd> + <kbd>Enter</kbd>: **run** a cell in place.
- <kbd>Shift</kbd> + <kbd>Enter</kbd>: to **run** the cell and move **focus** to the next cell (adding one if none exists).
- <kbd>Alt</kbd> + <kbd>Enter</kbd>: **run** the cell and **insert** a new code cell immediately below it.
- <kbd>Ctrl</kbd> + <kbd>M</kbd> <kbd>Y</kbd>: **convert** a cell to a **code cell**.
- <kbd>Ctrl</kbd> + <kbd>M</kbd> <kbd>M</kbd>: **convert** a cell to a **text cell**.
- <kbd>Ctrl</kbd> + <kbd>M</kbd> <kbd>D</kbd>: **delete** current cell / selected cells.
- <kbd>Ctrl</kbd> + <kbd>M</kbd> <kbd>A</kbd>: **insert** a code cell **above**.
- <kbd>Ctrl</kbd> + <kbd>M</kbd> <kbd>B</kbd>: **insert** a code cell **below**.
- <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>M</kbd>: insert a **comment**.
- <kbd>Ctrl</kbd> + <kbd>Space</kbd> or <kbd>Tab</kbd>: **autocomplete**.
- <kbd>Ctrl</kbd> + <kbd>H</kbd>: global **find/replace**.
- <kbd>Ctrl</kbd> + <kbd>G</kbd>: global **find next**.

:::

::: tip
We can use system commands in Colab with `!<command>`. For example, `!git clone ...`.
:::

## Import libraries

~~~ bash
!pip install -q matplotlib-venn
# or
!apt-get -qq install -y libfluidsynth1
~~~

### Install permanently

{% hsbox "Install with `gsfuse` ([source](https://stackoverflow.com/a/57708521/1323473))" %}

Install `gcsfuse`,

```bash
!echo "deb http://packages.cloud.google.com/apt gcsfuse-bionic main" > /etc/apt/sources.list.d/gcsfuse.list
!curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
!apt -qq update
!apt -qq install gcsfuse
```

```bash
!mkdir googleBucketFolder
!gcsfuse --implicit-dirs colab-connect-bucket googleBucketFolder
```

::: hsbox Do these before continuing

- Create a new GCP project.
- Create a [service accout](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) and download a json file.
- Create a new [Google Storage Bucket](https://console.cloud.google.com/storage/browser) (you may be charged).

:::


```bash
%%writefile /key.json
{
  "type": "service_account",
  "project_id": "kora-id",
  "private_key_id": "xxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nxxxxxxx==\n-----END PRIVATE KEY-----\n",
  "client_email": "colab-7@kora-id.iam.gserviceaccount.com",
  "client_id": "100380920993833371482",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "...."
}
```

```bash
%env GOOGLE_APPLICATION_CREDENTIALS=/key.json
```

```bash
import sys
nb_path = 'googleBucketFolder'
sys.path.insert(0, nb_path)
```

Whenever you want to install a package,

```bash
!pip install --target=$nb_path transformers
```

{% endhsbox %}

{% hsbox "Install to Google Drive (My choice) ([source](https://ayoolafelix.hashnode.dev/how-to-permanently-install-a-module-on-google-colab-ckixqrvs40su044s187y274tc))" %}

```python
import os, sys
from google.colab import drive
drive.mount('/content/gdrive')
nb_path = '/content/notebooks'
# You may need to create INSTALLED_LIBS folder before following step
os.symlink('/content/gdrive/My Drive/Colab Notebooks/INSTALLED_LIBS', nb_path)
sys.path.insert(0, nb_path)
```

```python
!pip install --target=$nb_path transformers
```

From now, everytime you open a new notebook,

```python
import sys
sys.path.append('/content/gdrive/My Drive/Colab Notebooks/INSTALLED_LIBS')

from google.colab import drive
drive.mount('/content/gdrive')
```

```python
# Try?
!pip install --target=$nb_path transformers
```

{% endhsbox %}

## Upgrade/Switch TensorFlow versions

~~~ bash
# To determine which version you're using:
!pip show tensorflow
~~~

~~~ bash
# For the current version:
!pip install --upgrade tensorflow
~~~

~~~ bash
# For a specific version:
!pip install tensorflow==1.2
~~~

~~~ bash
# For the latest nightly build:
!pip install tf-nightly
~~~

## Git with Colab

Check out [my note for Git](/git).

~~~ python
# Initialize the git repository (optional)
!git init
~~~

~~~ bash
# Set the global username and email
!git config --global user.email "youremail@domain.com"
!git config --global user.name "Your Name"
~~~

~~~ bash
# Add all the files
!git add -A
# or
!git add .
~~~

~~~ bash
# Commit
!git commit -m "Comment for that commit"
~~~

~~~ bash
# Pass your Github credentials
!git remote rm origin # in the case you meet "fatal: remote origin already exists"
!git remote add origin https://<github-username>:<github-password>@github.com/<github-username>/<repository-name>.git
~~~

~~~ bash
# Push to origin
!git push -u origin master
~~~

If you don't want to use your username andd password, you can use "Personal access tokens" on Github. Create one [here](https://github.com/settings/tokens) and then use,

~~~ python
!git git remote add origin https://<username>:<access-token>@github.com/<username>/<repo>.git
~~~

## Keep Colab awake

<kbd>F12</kbd> then **Console** and type,

~~~ js
function ClickConnect(){
  console.log("Working");
  document.querySelector("colab-connect-button").shadowRoot.getElementById("connect").click()
}
setInterval(ClickConnect,60000)
~~~

## Change to current working directory

By default, the working directory is `/content/`. One can use below command to change to another place,

~~~ python
%cd /content/data-science-learning
~~~

From that point, we are working on `/content/data-science-learning`.

## Upload a file to Colab{% ref "https://colab.research.google.com/notebooks/io.ipynb#scrollTo=hauvGV4hV-Mh" %}

Each user has a "machine" in `/content/`.

Create a new cell and paste,

~~~ python
from google.colab import files

uploaded = files.upload()

for fn in uploaded.keys():
  print('User uploaded file "{name}" with length {length} bytes'.format(
      name=fn, length=len(uploaded[fn])))
~~~

Run ==2 times== this cell, at the 2nd time, you can choose your file.

### Using Google Drive

Run a cell containing following codes,

~~~ python
from google.colab import drive
drive.mount('/content/drive')
~~~

and then follow the guide on the screen. In order to access to the drive,

~~~ python
with open('/content/drive/My Drive/foo.txt', 'w') as f:
  f.write('Hello Google Drive!')
~~~

### Clone a repo from Github

~~~ python
!git clone https://github.com/dinhanhthi/data-science-learning.git
~~~

The cloned folder are stored in `/content/`. If you wanna `pull` requests, use,

~~~ python
%cd /content/data-science-learning
!git pull
~~~

## PyTorch with GPU

To enable GPU backend for your notebook, go to **Edit** → **Notebook Settings** and set **Hardware accelerator** to **GPU**.{% ref "https://jovianlin.io/pytorch-with-gpu-in-google-colab/" %}


## Install 7zip reader, GraphViz, PyDot, cartopy

~~~ bash
# https://pypi.python.org/pypi/libarchive
!apt-get -qq install -y libarchive-dev && pip install -q -U libarchive
import libarchive
~~~

~~~ bash
# https://pypi.python.org/pypi/pydot
!apt-get -qq install -y graphviz && pip install -q pydot
import pydot
~~~

~~~ bash
!apt-get -qq install python-cartopy python3-cartopy
import cartopy
~~~

## Save as HTML

Jupyter Notebook has an option to 'Download as' HTML (or other) format. Google Colaboratory does not.

1. [Install the nbconvert package](https://nbconvert.readthedocs.io/en/latest/install.html).
2. Save your Colab notebook.
4. In your terminal:

	~~~ bash
	jupyter nbconvert --to <output format> <filename.ipynb>
	# jupyter nbconvert --to html mynotebook.ipynb
	~~~

## Other functions

- Interrupt a long running python process: **Runtime** > **Interrupt execution** (<kbd>Alt</kbd> + <kbd>M</kbd> <kbd>I</kbd>).
- Support Jupyter magic commands, check full list [here](https://nbviewer.jupyter.org/github/ipython/ipython/blob/1.x/examples/notebooks/Cell%20Magics.ipynb).