---
layout: post
title: "Docker + GPUs"
tags: [MLOps, Docker, Backend]
toc: true
icon: docker.svg
keywords: "pybash tania rascia CI CD continuous integration deployment pipeline docker idea how to use airflow kubernetes k8s k apache container images dangling images vscode vsc visual studio code ssh container env environnement file variable nvidia docker runtime gpus tensorflow torch cudnn cuda toolkit cudatoolkit"
date: 2022-09-02
---

{% assign img-url = '/img/post/deploy/docker' %}

👉 Note: [All docker notes](/tags/docker/).
👉 [My Dockerfile setting up on Github.](https://github.com/dinhanhthi/my-dockerfiles)

## WSL + Windows

👉 Note: [WSL + Windows](/docker-wsl2-windows/#wsl-%2B-windows)

## With Tensorflow or PyTorch

👉 [Official doc for TF + docker](https://www.tensorflow.org/install/docker)
👉 Note: [Docker + TF](/tensorflow#installation-with-docker).
👉 [An example of docker pytorch with gpu support](https://github.com/dinhanhthi/git_dataswati/tree/master/docker-thi).

## Basic installation

::: warning
You must (successfully) install the GPU driver on your (Linux) machine before proceeding with the steps in this note. Go to the "[Check info](#check-info)" section to check the availability of your drivers.
:::

::: info
(Maybe **just for me**) It works perfectly on **Pop!_OS 20.04**, I tried it and we have a lot of problems with **Pop!_OS 21.10** so ==stay with 20.04==!
:::

``` bash
sudo apt update

sudo apt install -y nvidia-container-runtime
# You may need to replace above line with
sudo apt install nvidia-docker2
sudo apt install nvidia-container-toolkit

sudo apt install -y nvidia-cuda-toolkit
# restard required
```

If you have problems installing `nvidia-docker2`, read [this section](/docker-gpu/#install-nvidia-docker2)!

## Check info

``` bash
# Verify that your computer has a graphic card
lspci | grep -i nvidia
```

``` bash
# First, install drivers and check
nvidia-smi
# output: NVIDIA-SMI 450.80.02 Driver Version: 450.80.02    CUDA Version: 11.0
# It's the maximum CUDA version that your driver supports
```

``` bash
# Check current version of cuda
nvcc --version
# If nvcc is not available, it may be in /usr/local/cuda/bin/
# Add this location to PATH
# modify ~/.zshrc or ~/.bashrc
export PATH=/usr/local/cuda/bin:$PATH

# You may need to install
sudo apt install -y nvidia-cuda-toolkit
```

If below command doesn't work, try to install `nvidia-docker2` (read [this section](#install-nvidia-docker2)).

``` bash
# Install and check nvidia-docker
dpkg -l | grep nvidia-docker
# or
nvidia-docker version
```

``` bash
# Verifying –gpus option under docker run
docker run --help | grep -i gpus
# output: --gpus gpu-request GPU devices to add to the container ('all' to pass all GPUs)
```

### Does Docker work with GPU?

``` bash
# List all GPU devices
docker run -it --rm --gpus all ubuntu nvidia-smi -L
# output: GPU 0: GeForce GTX 1650 (...)
```

```bash
# ERROR ?
# docker: Error response from daemon: failed to create shim: OCI runtime create failed: container_linux.go:380: starting container process caused: process_linux.go:545: container init caused: Running hook #0:: error running hook: exit status 1, stdout: , stderr: nvidia-container-cli: initialization error: load library failed: libnvidia-ml.so.1: cannot open shared object file: no such file or directory: unknown.
```

```bash
# ERROR ?
# Error response from daemon: could not select device driver "" with capabilities: [[gpu]]

# Solution: install nvidia-docker2
```

``` bash
# Verifying again with nvidia-smi
docker run -it --rm --gpus all ubuntu nvidia-smi

# Return something like
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 510.54       Driver Version: 510.54       CUDA Version: 11.6     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce ...  Off  | 00000000:01:00.0 Off |                  N/A |
| N/A   55C    P0    11W /  N/A |    369MiB /  4096MiB |      5%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
# and another box like this
```

::: hsbox It's archived, but still useful

``` bash
# Test a working setup container-toolkit
# Update 14/04/2022: the tag "latest" has deprecated => check your system versions and use
# the corresponding tag
# The following code is for reference only, it no longer works
docker run --rm --gpus all nvidia/cuda nvidia-smi
```

``` bash
# Test a working setup container-runtime
# Update 14/04/2022: below code isn't working anymore because nvidia/cuda doesn't have
# the "latest" tag!
docker run --runtime=nvidia --rm nvidia/cuda nvidia-smi

# Error response from daemon: Unknown runtime specified nvidia.
# Search below for "/etc/docker/daemon.json"
# Maybe it helps.
```

:::



### Check `cudnn`

```bash
whereis cudnn
# cudnn: /usr/include/cudnn.h

# Check cudnn version
cat /usr/include/cudnn.h | grep CUDNN_MAJOR -A 2
# or try this (it works for me, cudnn 8)
cat /usr/include/cudnn_version.h | grep CUDNN_MAJOR -A 2
```



## Install `nvidia-docker2`

{% hsbox "More information ([ref](https://github.com/NVIDIA/nvidia-docker/issues/1268))" %}

> This package is the only docker-specific package of any of them. It takes the script associated with the `nvidia-container-runtime` and installs it into docker's `/etc/docker/daemon.json` file for you. This then allows you to run (for example) `docker run --runtime=nvidia ...` to automatically add GPU support to your containers. It also installs a wrapper script around the native docker CLI called `nvidia-docker` which lets you invoke docker without needing to specify `--runtime=nvidia` every single time. It also lets you set an environment variable on the host (NV_GPU) to specify which GPUs should be injected into a container.

{% endhsbox %}

👉 (Should follow this for the up-to-date) [Officicial guide to install](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#docker).

**Note**: (Only for me) Use the codes below.

{% hsbox "Command lines (for quickly preview)" %}

``` bash
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)

# NOTE FOR POPOS 20.04
# replace above line with
distribution=ubuntu20.04

curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt-get update
sudo apt-get install -y nvidia-docker2
```

👇 Read more about [below error](https://gist.github.com/kuang-da/2796a792ced96deaf466fdfb7651aa2e#install-nvidia-docker2).

```bash
# Error?
# Read more:
# Depends: nvidia-container-toolkit (>= 1.9.0-1) but 1.5.1-1pop1~1627998766~20.04~9847cf2 is to be installed

# create a new file
sudo nano /etc/apt/preferences.d/nvidia-docker-pin-1002
# with below content
Package: *
Pin: origin nvidia.github.io
Pin-Priority: 1002
# then save

# try again
sudo apt-get install -y nvidia-docker2
```

```bash
# restart docker
sudo systemctl restart docker

# wanna check?
sudo docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```



{% endhsbox %}

``` bash
# check version
nvidia-docker version
```

## Difference: `nvidia-container-toolkit` vs `nvidia-container-runtime`

👉 [What's the difference between the lastest nvidia-docker and nvidia container runtime？](https://github.com/NVIDIA/nvidia-docker/issues/1268)

> In this note, with Docker 19.03+ (`docker --version`), he says that `nvidia-container-toolkit` is used for `--gpus` (in `docker run ...`), `nvidia-container-runtime` is used for `--runtime=nvidia` (can also be used in `docker-compose` file).

> However, <mark markdown="span">if you want to use Kubernetes with Docker 19.03, you actually **need to continue using nvidia-docker2**</mark> because Kubernetes doesn't support passing GPU information down to docker through the `--gpus` flag yet. It still relies on the nvidia-container-runtime to pass GPU information down the stack via a set of environment variables.

👉 [Installation Guide — NVIDIA Cloud Native Technologies documentation](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#docker)

## Using docker-compose?

Purpose?

<div class="col-2-equal">

``` bash
# instead of using
docker run \
    --gpus all\
    --name docker_thi_test\
    --rm\
    -v abc:abc\
    -p 8888:8888
```

``` bash
# we use this with docker-compose.yml
docker-compose up
```
</div>

``` bash
# check version of docker-compose
docker-compose --version
```

``` bash
# If "version" in docker-compose.yml < 2.3
# Modify: /etc/docker/daemon.json
{
    "default-runtime": "nvidia",
    "runtimes": {
        "nvidia": {
            "path": "nvidia-container-runtime",
            "runtimeArgs": []
        }
    }
}
```

``` bash
# restart our docker daemon
sudo pkill -SIGHUP dockerd
```

``` bash
# If "version" in docker-compose.yml >=2.3
# docker-compose.yml => able to use "runtime"
version: '2.3' # MUST BE >=2.3 AND <3
services:
  testing:
    ports:
      - "8000:8000"
    runtime: nvidia
    volumes:
      - ./object_detection:/object_detection
```

👉 Check more in my repo [my-dockerfiles](https://github.com/dinhanhthi/my-dockerfiles) on Github.

Run the test,

``` bash
docker pull tensorflow/tensorflow:latest-gpu-jupyter
mkdir ~/Downloads/test/notebooks
```

Without using `docker-compose.yml` (tensorflow) (cf. [this note](/tensorflow#without-docker-compose) for more)

``` bash
docker run --name docker_thi_test -it --rm -v $(realpath ~/Downloads/test/notebooks):/tf/notebooks -p 8888:8888 tensorflow/tensorflow:latest-gpu-jupyter
```

With `docker-compose.yml`?

``` bash
# ~/Download/test/Dockerfile
FROM tensorflow/tensorflow:latest-gpu-jupyter
```

``` yaml
# ~/Download/test/docker-compose.yml
version: '2'
services:
  jupyter:
    container_name: 'docker_thi_test'
    build: .
    volumes:
        - ./notebooks:/tf/notebooks # notebook directory
    ports:
        - 8888:8888 # exposed port for jupyter
    environment:
        - NVIDIA_VISIBLE_DEVICES=0 # which gpu do you want to use for this container
        - PASSWORD=12345
```

Then run,

``` bash
docker-compose run --rm jupyter
```

## Check usage of GPU

``` bash
# Linux only
nvidia-smi
```

::: hsbox Return something like this

``` bash
# |===============================+======================+======================|
# |   0  GeForce GTX 1650    Off  | 00000000:01:00.0 Off |                  N/A |
# | N/A   53C    P8     2W /  N/A |   3861MiB /  3914MiB |      2%      Default |
# |                               |                      |                  N/A |
# +-------------------------------+----------------------+----------------------+

# => 3861MB / 3914MB is used!

# +-----------------------------------------------------------------------------+
# | Processes:                                                       GPU Memory |
# |  GPU       PID   Type   Process name                             Usage      |
# |=============================================================================|
# |    0      3019      C   ...e/scarter/anaconda3/envs/tf1/bin/python  3812MiB |
# +-----------------------------------------------------------------------------+

# => Process 3019 is using the GPU
```

:::

``` bash
# All processes that use GPU
sudo fuser -v /dev/nvidia*
```

### Kill process

``` bash
# Kill a single process
sudo kill -9 3019
```

## Reset GPU

::: col-2-equal
``` bash
# all
sudo nvidia-smi --gpu-reset
```

``` bash
# single
sudo nvidia-smi --gpu-reset -i 0
```
:::

## Errors with GPU

``` bash
# Failed to get convolution algorithm. This is probably because cuDNN failed to initialize, so try looking to see if a warning log message was printed above.
# Function call stack:
# train_function
```

👉 Check [this answer](https://stackoverflow.com/a/56511889/1323473) as a reference!

👇 [Use a GPU](https://www.tensorflow.org/guide/gpu).

```python
# Limit the GPU memory to be used
gpus = tf.config.list_physical_devices('GPU')
if gpus:
  # Restrict TensorFlow to only allocate 1GB of memory on the first GPU
  try:
    tf.config.set_logical_device_configuration(
        gpus[0],
        [tf.config.LogicalDeviceConfiguration(memory_limit=1024)])
    logical_gpus = tf.config.list_logical_devices('GPU')
    print(len(gpus), "Physical GPUs,", len(logical_gpus), "Logical GPUs")
  except RuntimeError as e:
    # Virtual devices must be set before GPUs have been initialized
    print(e)
```

---

Problems with pytorch versions: [check this](/pytorch#errors).

---

_RuntimeError: cuda runtime error (804) : forward compatibility was attempted on non supported HW at /pytorch/aten/src/THC/THCGeneral.cpp:47_ (after update system including nvdia-cli, maybe) => The same problem with below, need to restart the computer.

---

`nvidia-smi`: _Failed to initialize NVML: Driver/library version mismatch_.

[This thread](https://stackoverflow.com/questions/43022843/nvidia-nvml-driver-library-version-mismatch): just restart the computer.

## Make NVIDIA work in docker (Linux)

::: danger
This section still works (on 26-Oct-2020), but it's obselete for newer methods.
:::

**One idea**: Use NVIDIA driver of the base machine, don't install anything in Docker!


{% hsbox "Detail of steps" %}

{:.noindent}
1. First, [maker sure](/pytorch#installation) your base machine has an NVIDIA driver.

	``` bash
	# list all gpus
	lspci -nn | grep '\[03'
	
	# check nvidia & cuda versions
	nvidia-smi
	```
2. Install [`nvidia-container-runtime`](https://github.com/NVIDIA/nvidia-container-runtime)

	``` bash
	curl -s -L https://nvidia.github.io/nvidia-container-runtime/gpgkey | sudo apt-key add -
	distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
	
	curl -s -L https://nvidia.github.io/nvidia-container-runtime/$distribution/nvidia-container-runtime.list | sudo tee /etc/apt/sources.list.d/nvidia-container-runtime.list
	
	sudo apt-get update
	
	sudo apt-get install nvidia-container-runtime
	```
3. Note that, <mark markdown='span'>we cannot use `docker-compose.yml` in this case!!!</mark>
4. Create an image `img_datas` with `Dockerfile` is

	``` docker
	FROM nvidia/cuda:10.2-base
	
	RUN apt-get update && \
		apt-get -y upgrade && \
		apt-get install -y python3-pip python3-dev locales git
	
	# install dependencies
	COPY requirements.txt requirements.txt
	RUN python3 -m pip install --upgrade pip && \
		python3 -m pip install -r requirements.txt
	COPY . .
	
	# default command
	CMD [ "jupyter", "lab", "--no-browser", "--allow-root", "--ip=0.0.0.0"  ]
	```
5. Create a container,

	``` bash
	docker run --name docker_thi --gpus all -v /home/thi/folder_1/:/srv/folder_1/ -v /home/thi/folder_1/git/:/srv/folder_2 -dp 8888:8888 -w="/srv" -it img_datas
	
	# -v: volumes
	# -w: working dir
	# --gpus all: using all gpus on base machine
	```

[This article](https://towardsdatascience.com/how-to-properly-use-the-gpu-within-a-docker-container-4c699c78c6d1) is also very interesting and helpful in some cases.

{% endhsbox %}

## References

1. [Difference between `base`, `runtime` and `devel` in `Dockerfile` of CUDA](https://github.com/NVIDIA/nvidia-docker/wiki/CUDA).
2. [Dockerfile on Github](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/tools/dockerfiles/dockerfiles) of Tensorflow.
