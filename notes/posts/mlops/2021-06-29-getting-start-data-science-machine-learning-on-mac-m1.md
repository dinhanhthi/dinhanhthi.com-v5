---
layout: post
title: "DS & ML with Mac M1"
tags: [MLOps, Data Science, Machine Learning, Deep Learning]
toc: true
icon: macos_ml.png
keywords: "data science machine learning tensorflow deep learning mac m1 macos apple getting start installation python pip package docker images arm chip max m1max m1pro pro"
date: 2022-10-19
---

This is my personal list of to-do things for a new Macbook.

👉 Note: [Mac fresh start](/fresh-install-macos/).
👉 Note: [Python installation](/python-installation/).
👉 Note: [Docker 101](/docker/).

👉 [My dockerfiles](https://github.com/dinhanhthi/my-dockerfiles/tree/master/docker-ai) on Github.

::: info

**Updated on 22/Mar/22**: There is [no way](https://github.com/tensorflow/tensorflow/issues/52845) to install Tensorflow with Docker on Mac M1.

:::

## Installation

``` bash
# Install XCode (from Appstore)

# Install XCode Command Line Tolls
xcode-select --install

# Download & install miniforge3
# https://github.com/conda-forge/miniforge
# (Choose "MacOSX-arm64" version)

chmod +x ~/Downloads/Miniforge3-MacOSX-arm64.sh
sh ~/Downloads/Miniforge3-MacOSX-arm64.sh
source ~/miniforge3/bin/activate

# Restart terminal and check
which python
# /Users/thi/miniforge3/bin/python
which pip
# /Users/thi/miniforge3/bin/pip
```

``` bash
# Init conda with zsh?
conda init zsh
source ~/.zshrc
```

### With PyTorch

::: info

**Updated on 22/Mar/22**: M1 **GPU** support [is under working](https://github.com/pytorch/pytorch/issues/47702#issuecomment-965625139).

:::

Make sure [the package on anaconda](https://anaconda.org/pytorch/pytorch) supports `osx-arm64` and try:

```bash
conda install -c pytorch pytorch
# If not working, try
pip3 install torch torchvision
```

**Note**: not guarantee it will work!

```python
# Verification
import torch
x = torch.rand(5, 3)
print(x)
```

### With Tensorflow + virtual environnement

:point_right: [Getting Started with tensorflow-metal PluggableDevice](https://developer.apple.com/metal/tensorflow-plugin/) | **Apple Official doc** (required macOS 12.0+)

``` bash
# Create virtual env
conda create -n ds-tf2.5 python=3.9.5
conda activate ds-tf2.5

# Install Tensorflow dependencies
conda install -c apple tensorflow-deps

# Install base tensorflow
python -m pip install tensorflow-macos

# Install metal plugin
python -m pip install tensorflow-metal
```

``` bash
# Install needed packages
conda install --file requirements.txt

# single package
conda install -y scikit-learn
# check after installing
pip show scikit-learn
```

:point_right: [Install scikit-learn on M1](https://scikit-learn.org/stable/install.html#installing-on-apple-silicon-m1-hardware) (official note).
:point_right: **Note**: [Python installation](/python-installation/).

## Verifying Installation

### With Tensorflow

``` bash
python

# In python environement
import tensorflow as tf
print(tf.__version__)
```

Or checking the working of GPU, CPU,...

``` bash
# Jupyter Notebook
jupyter lab
```

Then in the notebook,

```python
import tensorflow as tf
import tensorflow_datasets as tfds
print("TensorFlow version:", tf.__version__)
print("Num GPUs Available: ", len(tf.config.experimental.list_physical_devices('GPU')))
print("Num CPUs Available: ", len(tf.config.experimental.list_physical_devices('CPU')))

# Returns
TensorFlow version: 2.5.0
Num GPUs Available:  1
Num CPUs Available:  1
```

::: hsbox Example code

```bash
# Make sure these packages are installed
pip install tensorflow-datasets pandas jupyterlab
```

```python
(ds_train, ds_test), ds_info = tfds.load(
    'mnist',
    split=['train', 'test'],
    shuffle_files=True,
    as_supervised=True,
    with_info=True,
)

def normalize_img(image, label):
  """Normalizes images: `uint8` -> `float32`."""
  return tf.cast(image, tf.float32) / 255., label

batch_size = 128
ds_train = ds_train.map(
    normalize_img, num_parallel_calls=tf.data.experimental.AUTOTUNE)
ds_train = ds_train.cache()
ds_train = ds_train.shuffle(ds_info.splits['train'].num_examples)
ds_train = ds_train.batch(batch_size)
ds_train = ds_train.prefetch(tf.data.experimental.AUTOTUNE)
ds_test = ds_test.map(
    normalize_img, num_parallel_calls=tf.data.experimental.AUTOTUNE)

ds_test = ds_test.batch(batch_size)
ds_test = ds_test.cache()
ds_test = ds_test.prefetch(tf.data.experimental.AUTOTUNE)

model = tf.keras.models.Sequential([
  tf.keras.layers.Conv2D(32, kernel_size=(3, 3),
                 activation='relu'),
  tf.keras.layers.Conv2D(64, kernel_size=(3, 3),
                 activation='relu'),
  tf.keras.layers.MaxPooling2D(pool_size=(2, 2)),
  tf.keras.layers.Flatten(),
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dense(10, activation='softmax')
])

model.compile(
    loss='sparse_categorical_crossentropy',
    optimizer=tf.keras.optimizers.Adam(0.001),
    metrics=['accuracy'],
)

model.fit(
    ds_train,
    epochs=12,
    validation_data=ds_test,
)
```

:::

## Troubleshooting

✳️ _RuntimeError: module compiled against API version 0x10 but this version of numpy is 0xe_

```bash
pip install numpy --upgrade
```



## References

- **Apple Developer** -- [Getting Started with tensorflow-metal PluggableDevice](https://developer.apple.com/metal/tensorflow-plugin/).
- **MakeOptim** -- [AI - Apple Silicon Mac M1 natively supports TensorFlow 2.5 GPU acceleration (tensorflow-metal PluggableDevice)](https://makeoptim.com/en/deep-learning/tensorflow-metal).