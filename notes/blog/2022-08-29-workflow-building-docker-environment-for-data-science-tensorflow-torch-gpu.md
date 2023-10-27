---
layout: blog
title: "A workflow for creating a Docker image with support for TensorFlow, PyTorch, and GPU"
description: "How I build a Dockerfile for myself to work in Data Science?"
tags: [MLOps, Docker, Backend]
toc: true
math: false
keywords: "cuda gpu nvidia cudnn versions tensorflow torch pytorch docker-compose docker iamges container pip zsh bash"
date: 2022-08-30
---

A notable point in this post is the installation of **TensorFlow 2.9.1** (TF) with **CUDA 11.3**, which is not officially supported!

👉 **Note**: [All Docker notes](/tags/docker/).

::: warning

Since the version of what is to be mentioned in this post is really important, keep in mind that what I write are for the time I am writing this post!

:::

## From this to that

I want to create a Dockerfile based on a machine with the following specifications,

- **My computer**: Dell XPS 7590 (Intel i7 9750H/2.6GHz, GeForce GTX 1650 Mobile, RAM 32GB, SSD 1TB).
- **OS**: [Pop!_OS 20.04 LTS](https://pop.system76.com/) (a distribution based upon Ubuntu 20.04).
- **Nvidia driver** (on the physical machine): 510.73.05
- **CUDA** (on the physical machine): 10.1
- **Docker engine**: 20.10.17
- **Python**: 3.9.7

In this Dockerfile we can create a container that supports,

- **TensorFlow**: 2.9.1.
- **PyTorch**: 1.12.1+cu113
- **CUDA**: 11.3
- **cuDNN**: 8
- **Python**: 3.8.10
- **OS**: Ubuntu 20.04.5 LTS (Focal Fossa)
- **[Zsh](https://zsh.sourceforge.io/)** & **[oh-my-zsh](https://ohmyz.sh/)** are already installed.
- **[Jupyter notebook](https://jupyter.org/)** is installed and automatically runs as an entrypoint.
- **[OpenSSH](https://www.openssh.com/)** support (for accessing the container via SSH)

::: info

[The final Dockerfile](https://github.com/dinhanhthi/my-dockerfiles/blob/master/docker-ai/Dockerfile.cu113-cudnn8-tf291-torch112-u2004) on Github.

:::



## TL;DR;

::: tip

Yes, you don't have to read other sections, just this one for everything run!

:::

::: hsbox Show details

1. Install GPU driver, [Docker](https://www.docker.com/) and make them communicate to each other, read [my note about Docker & GPU](/docker-gpu/).

2. If you don't want to understand and just use my *Dockerfile* to build an image, read "[The final workflow](#the-final-workflow)" section.

3. **Motivation**: I want to try [detectron2](https://github.com/facebookresearch/detectron2) which requires CUDA 11.3 and the largest version of CUDA supported by TensorFlow is 11.2.

4. Create [a Dockerfile](https://github.com/dinhanhthi/my-dockerfiles/blob/master/docker-ai/Dockerfile.sample-cu113-u2004) based on [this official image from NVIDIA](https://hub.docker.com/layers/cuda/nvidia/cuda/11.3.1-cudnn8-devel-ubuntu20.04/images/sha256-459c130c94363099b02706b9b25d9fe5822ea233203ce9fbf8dfd276a55e7e95?context=explore) (*nvidia/cuda:11.3.1-cudnn8-devel-ubuntu20.04*) to build a testing image.  This image has already CUDA 11.3 and cuDNN 8.

   ```bash
   # Create the image "img_sample" from the file "Dockerfile"
   docker build -t img_sample . -f Dockerfile

   # Create and run a container from the image "img_sample"
   docker run --name container_sample --gpus all -w="/working" img_sample bash

   # Enter the "container_sample" container
   docker exect -it container_sample bash

   # In the container "container_sample"

   # Check if the NVIDIA Driver is recognized
   nvidia-smi

   # Check the version of CUDA
   nvcc --version

   # Check the version of cuDNN
   cat /usr/include/cudnn_version.h | grep CUDNN_MAJOR -A 2
   ```

5. Follow [step 5 of the official tutorial](https://www.tensorflow.org/install/pip#step-by-step_instructions) with just a normal command:

   ```bash
   pip install tensorflow==2.9.1
   ```

   and verify the installation by

   ```bash
   # TF works with CPU?
   python3 -c "import tensorflow as tf; print(tf.reduce_sum(tf.random.normal([1000, 1000])))"
   # TF works with GPU?
   python3 -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"
   ```

   If everything is OK, we are successfull!

6. Then add the installation of PyTorch by

   ```dockerfile
   # Dockerfile
   RUN pip3 install torch==1.12.1+cu113 torchvision==0.13.1+cu113 torchaudio==0.12.1 --extra-index-url https://download.pytorch.org/whl/cu113
   ```

7. And other stuffs

   ```dockerfile
   # Install python packages in the requirements.txt file
   COPY requirements.txt requirements.txt
   RUN python3 -m pip install --upgrade pip && \
       python3 -m pip install -r requirements.txt
   COPY . .

   # Install and setup Zsh to replace the default "bash"
   RUN apt-get install -y zsh && apt-get install -y curl
   RUN PATH="$PATH:/usr/bin/zsh"
   RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

   # Install OpenSSH
   RUN apt-get install -y openssh-server
   RUN mkdir /var/run/sshd
   RUN echo 'root:qwerty' | chpasswd
   RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
   RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
   ENV NOTVISIBLE "in users profile"
   RUN echo "export VISIBLE=now" >> /etc/profile
   EXPOSE 22
   ```

8. Go back to "[The final workflow]()" to see how it will be used after all.

:::



## Motivation

I want to try [detectron2](https://github.com/facebookresearch/detectron2) from Meta AI, a library that provides state-of-the-art detection and segmentation algorithms. This library [requires](https://detectron2.readthedocs.io/en/latest/tutorials/install.html) the use of `cuda=1.13` for a smooth installation. Therefore, I need a Docker container with `cuda=1.13` + TensorFlow  + PyTorch for this task. However, the latest version of `cuda` that is officially supported by TF is `cuda=11.2`.

If you do not necessarily need a special version of `cuda` that TF may not support, you can simply use [TF's official Docker images](https://www.tensorflow.org/install/docker).

So, if you find that [the versions of TF, CUDA and cudnn](https://www.tensorflow.org/install/source#gpu) match, just use it as a base Docker image or follow [the official instructions from TensorFlow](https://www.tensorflow.org/install). This post is a general idea how we can install TF with other versions of CUDA and cuDNN.



## The final workflow

::: hsbox Show details

1. Download this [Dockerfile](https://github.com/dinhanhthi/my-dockerfiles/blob/master/docker-ai/Dockerfile.cu113-cudnn8-tf291-torch112-u2004) file and rename it as `Dockerfile` (Yes, without extension!).

2. Create a *requirements.txt* file and add all the required Python packages (with their versions) there, like so

   ```bash
   matplotlib==3.3.4
   pandas==1.1.5
   scikit-learn==0.24.2
   ```

3. Create a new Docker image with name "img_ai"

   ```bash
   docker build -t img_ai . -f Dockerfile
   ```

4. Create and start a new container with name "container_ai" based on image `img_ai`

   ```bash
   docker run --name container_ai --gpus all \
     -v /home/thi/git/:/git/ \ # Change to your local directory
     -dp 8888:8888 \
     -dp 6789:22 \
     -w="/git" -it img_ai
   ```

5. Enter the container and check

   ```bash
   docker exec -it container_ai zsh # Yes, we use zsh!!!
   ```

   In the container,

   ```bash
   # GPU driver
   nvidia-smi

   # CUDA version
   nvcc --version

   # cuDNN version
   cat /usr/include/cudnn_version.h | grep CUDNN_MAJOR -A 2

   # TensorFlow works with CPU?
   python3 -c "import tensorflow as tf; print(tf.reduce_sum(tf.random.normal([1000, 1000])))"

   # TensorFlow works with GPU?
   python3 -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"

   # Torch works with GPU?
   python3 -c "import torch; print(torch.cuda.is_available())"
   ```

6. If you want to use SSH to access the container?

   ```bash
   # First run the ssh server in the container first
   docker exec container_ai $(which sshd) -Ddp 22

   # Access it via
   ssh -p 6789 root@localhost
   # password of root: qwerty
   ```

7. Go to http://localhost:8888 to open the Jupyter Notebook.

That's it!

:::



## Installation and setup

Make sure the GPU driver is successfully installed on your machine and read [this note](/docker-gpu/) to allow Docker Engine communicate with this physical GPU.

Basically, the following codes should work.

```bash
# Check if a GPU is available
lspci | grep -i nvidia

# Check NVIDIA driver info
nvidia-smi

# Check the version of cuda
nvcc --version

# Verify your nvidia-docker installation
docker run --gpus all --rm nvidia/cuda nvidia-smi
```

::: warning

If `docker -v` gives a version earlier than 19.03, you have to use `--runtime=nvidia` instead of `--gpus all`.

:::

## Choose a base image

Most problems come from TF, it is imperative to adjust the version of TF, CUDA, cuDNN. You can check [this link](https://www.tensorflow.org/install/source#gpu) for the corresponding versions between TF, cuDNN and CUDA (we call it "list-1"). A natural way to choose a base image is from [a TF docker image](https://www.tensorflow.org/install/docker) and then install separately PT. This is a [Dockerfile I built with this idea](https://github.com/dinhanhthi/my-dockerfiles/blob/master/docker-ai/Dockerfile.tf281-cu112-torch112) (*tf-2.8.1-gpu, torch-1.12.1+cu113*). However, as you can see in the "list-1" list, the official TF only supports *CUDA 11.2* (or *11.0* or *10.1*). If you want to install TF with *CUDA 11.3*, it's impossible if you start from the official build.

Based on [the official tutorial](https://www.tensorflow.org/install/pip) of installing TF with `pip`, to install TF 2.9.1, we need `cudatoolkit=11.2` and `cudnn=8.1.0`. What if we handle to have `cuda=11.3` and `cudnn=8` first and then we look for a way to install TF 2.9?

From [the NVIDIA public hub repository](https://hub.docker.com/u/nvidia), I found [this image](https://hub.docker.com/layers/cuda/nvidia/cuda/11.3.1-cudnn8-devel-ubuntu20.04/images/sha256-459c130c94363099b02706b9b25d9fe5822ea233203ce9fbf8dfd276a55e7e95?context=explore) (_nvidia/cuda:11.3.1-cudnn8-devel-ubuntu20.04_) which has already installed `cuda=11.3` and `cudnn=8`.

::: info

What is the difference between `base`, `runtime` and `devel` in the name of images from the NVIDIA public hub? [Check this](https://github.com/NVIDIA/nvidia-docker/wiki/CUDA#description).

:::

I create a very simple _Dockerfile_ starting from this base image to check if we can install `torch=1.12.1+cu113` and `tensorflow=2.9.1`.

👉  [A simple "Dockerfile" file based on `nvidia/cuda:11.3.1-cudnn8-devel-ubuntu20.04`](https://github.com/dinhanhthi/my-dockerfiles/blob/master/docker-ai/Dockerfile.sample-cu113-u2004)

```bash
# Create the image "img_sample" from the file "Dockerfile"
docker build -t img_sample . -f Dockerfile

# Create and run a container from the image "img_sample"
docker run --name container_sample --gpus all -w="/working" img_sample bash

# Enter the "container_sample" container
docker exect -it container_sample bash

# In the container "container_sample"

# Check if the NVIDIA Driver is recognized
nvidia-smi

# Check the version of CUDA
nvcc --version

# Check the version of cuDNN
cat /usr/include/cudnn_version.h | grep CUDNN_MAJOR -A 2
```

Then I try to install `tensorflow` from [step 5 of this official tutorial](https://www.tensorflow.org/install/pip#step-by-step_instructions),

```bash
pip install --upgrade pip
pip install tensorflow==2.9.1
```

**YES**! It's that simple!

Let us check if it works (step 6 in the tutorial)?

```bash
# Verify the CPU setup
python3 -c "import tensorflow as tf; print(tf.reduce_sum(tf.random.normal([1000, 1000])))"
# A tensor should be return, something like
# tf.Tensor(-686.383, shape=(), dtype=float32)

# Verify the GPU setup
python3 -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"
# A list of GPU devices should be return, something like
# [PhysicalDevice(name='/physical_device:GPU:0', device_type='GPU')]
```

🎉 Voilà, it works like clockwork!

## Add more things in the Dockerfile

Basically, we are done with the main part of this post. This section mainly explains why I also include the Zsh installation and OpenSSH setup in the Dockerfile.

### Python libraries

All normally used packages (with their corresponding versions) are stored in the `requirements.txt` file. We need into copy this file to the container and start the installation process,

```dockerfile
COPY requirements.txt requirements.txt
RUN python3 -m pip install --upgrade pip && \
    python3 -m pip install -r requirements.txt
COPY . .
```

### PyTorch

Install PyTorch by following [the official instructions](https://pytorch.org/get-started/locally/),

```dockerfile
RUN pip3 install torch==1.12.1+cu113 torchvision==0.13.1+cu113 torchaudio==0.12.1 --extra-index-url https://download.pytorch.org/whl/cu113
```

### Zsh

👉 Note: [Terminal + ZSH](/terminal/).

Add the following lines to install and set up Zsh. **Why do we need Zsh** instead of the default `bash`? Because we need a better look of the command lines and not just white texts. Another problem sometimes arises from the "backspace" key on the keyboard. When you type something and use the backspace key to correct the mistake, the previous character is not removed as it should be, but other characters appear. This problem was mentioned once before at the end of [this section in another note](/google-vertex-ai/#ssh-to-user-managed-notebook).

```dockerfile
# Dockerfile
RUN apt-get install -y zsh && apt-get install -y curl
RUN PATH="$PATH:/usr/bin/zsh"
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

After Zsh installed,

```bash
# Instead of using this
docker exec -it docker_name bash

# Use this
docker exec -it docker_name zsh
```

One note: When adding an alias, be sure to add it to both `.bashrc` and `.zshrc` as follows,

```dockerfile
# Dockerfile
RUN echo 'alias python="python3"' >> ~/.bashrc
RUN echo 'alias python="python3"' >> ~/.zshrc
```

### OpenSSH

👉 Note: [Local connection between 2 computers](/local-connection-between-2-computers-ssh/).

If you want to access a running container via SSH, you must install and run OpenSSH in that container and expose the port `22`.

```dockerfile
# Dockerfile
RUN apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN echo 'root:qwerty' | chpasswd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile
EXPOSE 22
```

Don't forget to export port `22` when you create a new container,

```bash
docker run --name container_name --gpus all \
	-dp: 6789:22
	# other options
	-it image_name
```

One more step: If a jupyter notebook is running (at port `8888`) in your container, you need to run the following code to get the SSH server running,

```bash
docker exec docker_ai $(which sshd) -Ddp 22
```

Now if you want to access this container via SSH,

```bash
ssh -p 6789 root@localhost
```

Let's use the password `qwerty` (it's set in the above code, at line `RUN echo 'root:qwerty' | chpasswd`)!

### JupyterLab

It's great if our image has a running jupyter notebook server as an entry point so every time we create a new container, there's already a jupyter notebook running and we just use it.

```dockerfile
# Dockerfile
RUN python3 -m pip install jupyterlab

CMD /bin/bash -c 'jupyter lab --no-browser --allow-root --ip=0.0.0.0 --NotebookApp.token="" --NotebookApp.password=""'
```

Don't forget to expose the port `8888` when you create a new container,

```bash
docker run --name container_name --gpus all \
	-dp: 8888:8888
	# other options
	-it image_name
```

Go to http://localhost:8888 to open the notebook.
