---
layout: post
title: "Local connection between 2 computers"
tags: [Skills, Linux, Shell]
toc: false
icon: lan.svg
keywords: "ssh connection 2 computer local LAN open server terminal nomachine no machine"
date: 2022-10-20
---



**Scenario**: I wanna control / access my **comp1** (which **runs Linux**) from my **comp2** (which **runs MacOS**).
**Reason**: I cannot work with Data Science's stuff with **comp2** (Mac M1) whereas **comp1** has everything (Linux, GPU,...)

::: warning

Two computers must be connected to the same network!

:::


👉 Note: [SSH](/ssh/).
👉 Note: [ Docker  + GPUs](/docker-gpu/)
👉 Note: [Docker 101](/docker/)


## Control visually

I use **[NoMachine](https://www.nomachine.com/)** (I think it's faster and more controllable than TeamViewer).

::: hsbox Some useful settings

Go into **Server settings** > **Security**

- Tick "Blank the physical screen when somebody connects" (It helps turn off the controlled screen)
- **File transfers** section: tick /modify "Automatically save files in"

:::

### Connect to a NoMachine Server running on Windows

It requires username and password and you are connected using your Microsoft account, don't user the username and password being set up in the System Preferences, use your Microsoft Account credentials!

## Connect via SSH

👉 I learned from [this answer](https://askubuntu.com/a/1108044/248456).

❇️ On the "server computer" (**comp1** -- **Linux**)

```bash
# Knowing its name
hostname
# or `hostnamectl` or `cat /proc/sys/kernel/hostname`
# mine: pop-os

# Knowing current user
whoami
# mine: thi
# You must know the password!!!

# Install openssh-server
sudo apt update
sudo apt install openssh-server

# Check comp1's ip
ifconfig | grep "192.168"
# mine: 192.168.1.115
```

**Test**: connect from **comp1** to **comp1** itself!

```bash
ssh 127.0.0.1
# type user1's password
```

❇️ On the "client computer" (**comp2** -- **MacOS**)

```bash
# Connect via comp1's name
ssh thi@pop-os.local
# Type thi's password

# Connect via comp1's ip
ssh thi@192.168.1.115
```

❇️ Disconnect

```bash
exit
```

❇️ Copy files

```bash
# From client to remote
scp /from/client/file.zip thi@pop-os.local:/on/remote/
# (change the destination name)
scp /on/client/file.zip thi@pop-os.local:/on/remote/file_renamed.zip

# From remote to client
scp thi@pop-os.local:/on/remote/file.zip /on/client/
```

**Tip**: You can use a smtp client (eg: [CyberDuck](https://cyberduck.io/)) to make things visually

```bash
# server
pop-os.local # or using ip address
# port
22
# username
thi
# password
```



## Open Jupter Notebook running on comp1

👉 Note: [Docker](/docker/)
👉 Note: [SSH](/ssh/)

Suppose that there is a jupyter lab server which is running on **comp1** (In my case, it's running inside a docker container which is ported to **comp1** via port `8888`).

```bash
# On comp2
ssh -N -L localhost:8888:127.0.0.1:8888 thi@pop-os.local
# Remark: keep the terminal
```

Then open http://localhost:8888/lab to see the result!



## SSH to the docker container inside comp1

I wanna ssh to the container which is running on **comp1** from **comp2**.

❇️ Suppose that the running container on **comp1** is created from an ==image which hasn't set up the open-ssh by default==. **We will set up a server in the running container**,

```bash
# Check the name of running container
docker ps # mine: docker_ai

# Go inside the running container
docker exec -it docker_ai bash

# [in the container]

# Install ssh server
apt update && apt install openssh-server && apt install nano
# Change `root`'s password
passwd # suppose: qwerty

nano /etc/ssh/sshd_config
# and add
Port 2222
PermitRootLogin yes

# Restart ssh server
/etc/init.d/ssh start
```

In the `docker-compose.yml`

```yaml
# expose the ports
ports:
	- "6789:2222"
```

```bash
# Test on comp1
ssh -p 6789 root@localhost
# enter "qwerty" password for "root"

# Connect from comp2
ssh -p 6789 root@pop-os.local
# enter "qwerty" password for "root"
```

❇️  In case your image ==has already installed `openssh-server` but forgot to run it by default==. We will run the ssh server on port `22` for the running container.

::: hsbox The codes in `Dockerfile` which are used to install and set up `openssh-server`

```bash
RUN apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN echo 'root:qwerty' | chpasswd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
# need?
ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile
# Export port ssh
EXPOSE 22
```

:::

Add below line to `Dockerfile` if you wanna run the openssh-server by default

```bash
CMD $(which sshd) -Ddp 22
```

::: warning

We shouldn't (cannot??) run 2 servers in parallel in the docker image (for example, one for jupyter notebook on port `8888` and one for `openssh-server` on port `22`).

💡 In this case, you should keep the jupyter notebook running. Each time you wanna run the `openssh-server`, you can run

```bash
docker exec docker_ai $(which sshd) -Ddp 22 # and keep this tab open
# or
docker exec -d .... # detach mode
```

You can also do this ==completely from **comp2**==,

```bash
ssh thi@pop-os.local
# Then you are in comp1's terminal
docker exec ....
```

**Important remark**: If you enter the container's shell and then you wanna exit with `exit` or `logout` command. It also terminates the server and you have to run the server again!

:::



::: info

Don't forget to forward the port `22` (in container) to `6789` in **comp1** via `docker-compose.yml`.

:::

```bash
# On comp1
docker exec <container_name> $(which sshd) -Ddp 22
# Keep this tab open and running
```

```bash
# On comp2
ssh -p 6789 root@pop-os.local
# enter pwd: "qwerty" as in the Dockerfile
```

