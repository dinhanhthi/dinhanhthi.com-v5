---
layout: post
title: "Google Vertex AI"
tags: [API & Services, MLOps, Google, TensorFlow]
toc: true
icon: vertex.png
keywords: "vertex ai machine learning service google gcloud cli ngrok jupyter notebook virtual machine gcp port forwarding ssh connection ai platform google apis error [Errno 12] Cannot allocate memory base 64 base64 encoding decoding ascii encode decode utf-8 utf8"
date: 2022-05-17
---

{% assign img-url = '/img/post/api/vertex' %}

::: info
Like other notes on this site, this note contains only a few noteworthy points of the topic.
:::

👉 My Github Repo for this note: [dinhanhthi/google-vertex-ai](https://github.com/dinhanhthi/google-vertex-ai)
👉  [All services needed for Data Science on Google Cloud.](https://cloud.google.com/data-science)

## Good to know

- You should choose **the same location/region** for all services (google project, notebook instances,...). 👉 Check [this section](#same-locations).
- [Troubleshooting](https://cloud.google.com/vertex-ai/docs/general/troubleshooting).
- [Access Cloud Storage buckets](https://cloud.google.com/vertex-ai/docs/workbench/managed/cloud-storage).
- [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)
- [`gcloud ai`](https://cloud.google.com/sdk/gcloud/reference/ai/) references (for Vertex AI)
- ALways use [Logging service](https://console.cloud.google.com/logs/) to track the problems.
- When making models, especially for serving on prod, don't forget to use `logging` services.
- When creating a new notebook instance, consider to choose a larger size for "boot disk" (100GB is not enough as it is).
- If you run the gcp command lines in workbench, you don't have to give the credential for the connecting to gcp. It's automatically passed.


## Tutorials & references

1. [What is Vertex AI?](https://www.youtube.com/watch?v=gT4qqHMiEpA) -- Official video.
2. [Google Cloud Vertex AI Samples](https://github.com/GoogleCloudPlatform/vertex-ai-samples) -- Official github repository.
3. Vertex AI Documentation AIO: [Samples](https://cloud.google.com/vertex-ai/docs/samples) - [References](https://cloud.google.com/vertex-ai/docs/reference) -- [Guides](https://cloud.google.com/vertex-ai/docs/start/introduction-unified-platform).


## Notebooks (Workbench)

::: tip
If you are going to create images with `docker` inside the virtual machine, ==you should choose **more** boot disk space== (default = 100GB but you should choose more than that). In case you wanna change the size of disk, you can go to [Compute Engine / Disks](https://console.cloud.google.com/compute/disks){% ref "https://cloud.google.com/compute/docs/disks/resize-persistent-disk#resize_the_disk" %}.
:::

::: danger
Remember to shutdown the notebook if you don't use it!!
:::

### Workbench notebook vs Colab

👉 Note: [Google Colab](/google-colab/).

::: hsbox Show the table

|                    | Workbench notebook                | Colab                    |
| ------------------ | --------------------------------- | ------------------------ |
| Free               | No                                | Yes (but limit)          |
| Persistent storage | Yes                               | **No**                   |
| Easy to share      | No                                | Yes                      |
| Idle time          | No (user-managed) & Yes (Managed) | Yes (1h in free version) |

:::


### "Managed notebook" vs "User-managed notebook"

👉 [Official doc](https://cloud.google.com/vertex-ai/docs/workbench/notebook-solution). Below are some notable points.

::: hsbox Show the table

|                                                              | Managed notebook                                             | User-managed notebook                            |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------ |
| SSH                                                          | **[No](https://cloud.google.com/vertex-ai/docs/general/troubleshooting#unable_to_ssh_into_instance)** (but [we can](#ssh-managed) 😉) | Yes                                              |
| sudo access                                                  | **No**                                                       | Yes                                              |
| [Idle shutdown](https://cloud.google.com/vertex-ai/docs/workbench/managed/idle-shutdown) | Yes                                                          | **No** (==remember to shutdown when not using==) |
| Flexibility                                                  | No                                                           | Yes                                              |
| [Schedule notebook run](https://cloud.google.com/vertex-ai/docs/workbench/managed/schedule-managed-notebooks-run-quickstart) | Yes                                                          | **No**                                           |
| Connect with [Compute Engine](https://cloud.google.com/compute/docs) | **No**                                                       | Yes                                              |
| [Health status monitoring](https://cloud.google.com/vertex-ai/docs/workbench/user-managed/monitor-health) | No                                                           | Yes                                              |
| Use third-party jupyter lab extension                        | No                                                           | Yes                                              |
| Apply a custom script after creating new instance            | No                                                           | **Yes**                                          |
| Use a custom docker image (for a custom kernel in jupyter notebook, ==alongside with prebuilt things==) | **Yes**                                                      | No                                               |
| Can edit type of machine + GPU                               | Yes                                                          | Yes                                              |
| Can edit storage                                             | No                                                           | Yes                                              |

:::

### `gcloud` CLI

👉 [Official references](https://cloud.google.com/sdk/gcloud/reference).

```bash
# Start instance
gcloud compute instances start thi-managed-notebook --zone=europe-west1-d
```

```bash
# Stop instance
gcloud compute instances stop thi-managed-notebook --zone=europe-west1-d
```

### Sync with Github using `gh` CLI

Inside the notebook, open Terminal tab. Then install the Github CLI ([ref](https://github.com/cli/cli/blob/trunk/docs/install_linux.md#debian-ubuntu-linux-raspberry-pi-os-apt)),

```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
```

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
  | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
```

```bash
sudo apt update
sudo apt install gh
```

Login to gh,

```bash
gh auth login
```

Then following the guides.

### Open Juputer notebook on your local machine

The JupyterLab is running on Vertex Notebook at port `8080`. You have 2 options to open it on your local machine:

::: hsbox **Option 1**: Port forwarding
```bash
gcloud compute ssh \
  --project <project-id> \
  --zone <zone> <instance-name> \
  -- \
  -L 8081:localhost:8080
```

Then open `http://localhost:8081`
:::

::: hsbox **Option 2**: Using [`ngrok`](https://ngrok.com/)
First, you have to sign up an account on ngrok, without this step, you cannot open HTML pages.

Open Terminal in the Vertex machine and then [install `ngrok`](https://ngrok.com/download). Here, I use `snap`,

```bash
sudo apt update
sudo apt install snapd
sudo snap install ngrok
```

```bash
# Check
ngrok --version
```

If it's not found, you can find it in `/snap/ngrok/current`. Add this line to `.bashrc` or `.zshrc`,

```bash
export PATH="/snap/ngrok/current:$PATH"
```

Then `source ~/.bashrc` or `source ~/.zshrc` to make changes.

Log in to your ngrok account, go to [your AuthToken page](https://dashboard.ngrok.com/get-started/your-authtoken) and copy the token here. Back to the terminal on Vertex machine,

```bash
ngrok authtoken <token>
```

Then,

```bash
ngrok http 8080
```

It returns something like,

```bash
Account                       Anh-Thi Dinh (Plan: Free)
Version                       2.3.40
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://4c1f-34-79-165-21.ngrok.io -> http://localhost:8080
Forwarding                    https://4c1f-34-79-165-21.ngrok.io -> http://localhost:8080
```

Go to `http://4c1f-34-79-165-21.ngrok.io` and see the result!
:::

### SSH to User-managed notebook

::: warning
You have to use **User-managed notebook**! **Managed notebook** doesn't allow you to use SSH (officially).  If you wanna connect via SSH for **managed notebook**, read [next  section](#ssh-managed).
:::

First, connect using `gcloud` 👉 Note: [Google Cloud CLI](https://www.notion.so/thi-cs/gcloud-commands-f417c0cca00f4855b4e9fb2b7a785d90).

👉 Note: [SSH](/ssh/)

::: hsbox Connect via `gcloud` command + SSH port forwarding

👉 [Official doc](https://cloud.google.com/vertex-ai/docs/workbench/user-managed/ssh-access).

```bash
gcloud compute ssh --project <project-id> --zone <zone> <instance-name> -- -L 8081:localhost:8080
```

- You can find all information of `<thing>` by clicking the notebook name in Workbench. ==`8081` is the port on your machine== and `8080` is the port on vertex.
- For `<instance-name>`, you can also use instance id (which can be found in *Compute Engine* > *VM instances*)
- For the popup "Build Recommended" in JupyterLab, you can run `jupyter lab build`.

:::

{% hsbox "Connect via `ssh` (and also on VScode)" %}
You can follow [the official instructions](https://cloud.google.com/compute/docs/instances/connecting-advanced#thirdpartytools). For me, they're complicated. I use another way.

Make sur you've created a ssh keys on your local machine, eg. `/Users/thi/.ssh/id_rsa.ideta.pub` is mine.

```bash
# Show the public keys
cat /Users/thi/.ssh/id_rsa.ideta.pub
# Then copy it
```

On the vertex notabook instance (you can use `gcloud` method to access or just open the notebook on browser and then open Terminal).

```bash
# Make sure you are "jupyter" user
whoami # returns "jupyter"
# If not
su - jupyter
# If it asks your password, check next section in this note.
```

```bash
# Create and open /home/jupyter/.ssh/authorized_keys
nano /home/jupyter/.ssh/authorized_keys
# Then paste the public key you copied in previous step here
# Ctrl + X > Y > Enter to save!
```

On your local machine,

```bash
ssh -i /Users/thi/.ssh/id_rsa.ideta jupyter@<ip_of_notebook>
```

::: tip
The ip of the instance will change each time you reset the instance. Go to the Compute Engine section to check the up-to-date ip address.
:::

You are good. **On VScode**, you make the same things with the extension **Remote - SSH**.

- After running above command, you enter the instance's container (with your username, eg. when you run `whoami`, it will be `thi`) and you can also open `http://localhost:8081` for jupyer notebook on your local machine. **To stop**, type `exit` and also [[cmd]] + [[C]].
- The user (and folder) on which the notebook is running is `jupyter` (you can check `/home/jupyter/`). You can use `sudo - jupyter ` to change to this user.

{% endhsbox %}

::: hsbox Change password for default user and "jupyter" user

For example, default user after I connect via ssh is `thi` and the user for jupyter notebook is `jupyter`. However, you don't know their passwords. Just change them!

```bash
sudo passwd thi
# then entering the new password for this

sudo passwd jupyter
```
:::

::: hsbox (You should) Beaufity connected SSH terminal with **zsh**

**Why**? The default `bash` has a problem of "backspace" button when you connect via ssh.

👉 Note: [Zsh](/terminal/#zsh-linux).

```bash
sudo i
sudo apt install zsh # install zsh
```

Make zsh default for each user, below is for `jupyter`,

```bash
su - jupyter
chsh -s $(which zsh) # make zsh be default
exit # to log out
su - jupyter # log in again
# Then follow the instructions
```

Then, install `oh-my-zsh`,

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

Then install `spacehip` theme (optional),

```bash
git clone https://github.com/denysdovhan/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt"

ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
```

👉 [An example of simple `.zshrc` file.](https://gist.github.com/dinhanhthi/cae72fea9aa5cdf0442185cdea9457d9)

:::

### If you change the GPU type?

You have to re-install the GPU driver on the virtual machine. Check [this official instruction](https://cloud.google.com/compute/docs/gpus/install-drivers-gpu).



### SSH to managed notebook{:#ssh-managed}

When creating a new notebook, make sure to **enable terminal** for this notebook. Open the notebook and then open the terminal.

```bash
# On your local machine => check the public keys
cat ~/.ssh/id_rsa.pub
```

```bash
# On managed notebook, make sure you're at /home/jupyter
pwd
mkdir .ssh
touch .ssh/authorized_keys
vim .ssh/authorized_keys
# Paste the public key here
# Then save & exit (Press ESC then type :wq!)
```

```bash
# Check
cat .ssh/authorized_keys
```

```bash
# Check the external ip address of this notebook instance
curl -s http://whatismyip.akamai.com
```

Connect from local,

```bash
ssh -i ~/.ssh/id_rsa jupyter@<ip-returned-in-previous-step>
```

### AIO steps

**Remark**: This section is almost for me only (all the steps here are already described in previous steps).

::: danger
Remember to shutdown the notebook if you don't use it!!
:::

{% hsbox "Show the content" %}

```bash
# Update system
sudo apt update
```

```bash
# You have to use below line to install zsh
# The terminal on workbench doesn't allow to do that!
gcloud compute ssh --project <project-id> --zone <zone> <name-of-instance> -- -L 8081:localhost:8080
```

```bash
# Change user's password
sudo passwd thi
sudo passwd jupyter
```

**Go back to Terminal on Vertex** (to ==make sure you're `jupyter`==)

```bash
# Install zsh
sudo apt install zsh
chsh -s $(which zsh)

# Install oh-my-zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# Install theme "spaceship"
git clone https://github.com/denysdovhan/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt"
ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"

# Change theme to "spaceship"
nano ~/.zshrc # then change to "spaceship"

# Change the line of plugins too
plugins=(git docker docker-compose python emoji)

# Add alias
gs='git status'
ud_zsh='source ~/.zshrc'

# Update changes
source ~/.zshrc
```

```bash
# Add local ssh keys to this instance (for accessing via ssh)
# (Below is for local machine)
cat ~/.ssh/id_rsa.ideta.pub
# Then copy the public keys

# On vertex
mkdir ~/.ssh
nano /home/jupyter/.ssh/authorized_keys
# Then paste the key copied above to this and save

# If needed, make the same thing for user "thi"
```

```bash
# Install Github CLI
curl -fsSL \
  https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null

sudo apt update
sudo apt install gh

gh auth login
```

```python
# Add conda path
nano ~/.zshrc
# Then add the following to the end of the file
export PATH="/opt/conda/bin:$PATH"
# After that Ctrl + X > Y > Enter to save
source ~/.zshrc
```

```bash
# Add more space to swap
# (to prevent the error: "[Errno 12] Cannot allocate memory")
sudo dd if=/dev/zero of=/swapfile bs=1024 count=1024k
sudo mkswap /swapfile
sudo swapon /swapfile

# Check
sudo swapon -s
```

{% endhsbox %}

### Troubleshooting

::: hsbox `[Errno 12] Cannot allocate memory`

👉 [reference to this solution](https://stackoverflow.com/a/26416661/1323473)

```bash
sudo swapon -s
```

If it is empty it means you don't have any swap enabled. To add a 1GB swap:

```bash
sudo dd if=/dev/zero of=/swapfile bs=1024 count=1024k
sudo mkswap /swapfile
sudo swapon /swapfile
```

Add the following line to the `fstab` to make the swap permanent.

```bash
sudo nano /etc/fstab
/swapfile       none    swap    sw      0       0
```
:::

{% hsbox "`Error processing tar file(exit status 1): write /home/model-server/pytorch_model.bin: no space left on device`" %}

It's because disk space are full. You can check by running `df -h`,

```bash
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/sda1        99G   82G   13G  87% /
```

::: warning
If you use the notebook to create docker images, be careful, the spaces will be used implicitly (Use `docker info` to check where the images will be stored, normally they are in `/var/lib/docker` which belongs to boot disk spaces). You can check the unsed images by `docker images` and remove them by `docker image rm img_id`.
:::

__Wanna increase the disk space?__: Go to [Compute Engine / Disks](https://console.cloud.google.com/compute/disks) > Choose the right machine and edit the spaces{% ref "https://cloud.google.com/compute/docs/disks/resize-persistent-disk#resize_the_disk" %}.

{% endhsbox %}

## With Hugging Face models (A-Z){:#huggingface}

👉 [Hugging Face models](https://huggingface.co/models).

### A-Z text classification with PyTorch

👉 [Original repo & codes](https://github.com/GoogleCloudPlatform/vertex-ai-samples/tree/main/community-content/pytorch_text_classification_using_vertex_sdk_and_gcloud).
👉 [The official blog about this task](https://cloud.google.com/blog/topics/developers-practitioners/pytorch-google-cloud-how-deploy-pytorch-models-vertex-ai) (the notebook is good but you need to read this blog too, there are useful points and links)
👉 [My already-executed notebook](https://github.com/dinhanhthi/google-vertex-ai/blob/main/VIEW_ONLY_pytorch_text_classification_using_vertex_sdk_and_gcloud/VIEW_ONLY_pytorch-text-classification-vertex-ai-train-tune-deploy.ipynb) (There are my comments here).

{% hsbox "What they do (in short + what I understand)?" %}

1. Take [a model from Hugging Face](https://huggingface.co/bert-base-cased) + dataset IMDB + train again with this dataset to get only 2 sentiments -- "Positive" and "Negative". They cut the head of the model from HF and put another on top (**Fine tuning**).
2. They do all the steps (preprocessing, training, predicting, post processing) inside the notebook first and then use these functions in the container they create before pushing to Vertex AI's registry.
3. They run a custom job on Vertex AI with a [pre-built container](https://cloud.google.com/vertex-ai/docs/training/pre-built-containers) 👈 Before doing that "online", they perform the same steps locally to make things work!
4. They also show the way of using [custom container](https://cloud.google.com/vertex-ai/docs/training/create-custom-container?hl=hr) for the training task.
   1. Create a new docker image locally with `Dockerfile` and all neccessary settings.
   2. Push the image to [Google's Container Registry](https://console.cloud.google.com/gcr/images/).
   3. Using `aiplatform` to init + run the job on vertex ai.
5. **Hyperparameter Tuning**: Using Vertex AI to train the model with different values of the Hyperparameters and then choose the best one for the final model.
6. **Deploying**: they use [TorchServe](https://pytorch.org/serve/custom_service.html) + create a [custom container](https://cloud.google.com/vertex-ai/docs/predictions/custom-container-requirements) for prediction step.
   1. All the codes are in [folder `/predictor/`](https://github.com/dinhanhthi/google-vertex-ai/tree/main/VIEW_ONLY_pytorch_text_classification_using_vertex_sdk_and_gcloud/predictor)
   2. The most important codes are in [file `custom_handler.py`](https://github.com/dinhanhthi/google-vertex-ai/blob/main/VIEW_ONLY_pytorch_text_classification_using_vertex_sdk_and_gcloud/predictor/custom_handler.py) which makes the same things in the step of predicting locally (the beginning steps of the notebook)
   3. A custom image is created via file `Dockerfile`
   4. Test the image with a container locally before pusing to Vertex AI.
7. Create a model with this image and then deploy this model to an endpoint (this step can be done on the [Vertex platform](https://console.cloud.google.com/vertex-ai/endpoints)).

{% endhsbox %}

{% hsbox "Some notable codes in the notebook" %}

```bash
# Vertex AI SDK for Python
# https://googleapis.dev/python/aiplatform/latest/index.html
pip -q install --upgrade google-cloud-aiplatform
```

```bash
# Create a new bucket
gsutil mb -l <name>

# Check
gsutil ls -al <name>
```

```python
# To disable the warning:
# huggingface/tokenizers: The current process just got forked, after parallelism has
# already been used. Disabling parallelism to avoid deadlocks...
import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"
```

[Load & train](https://huggingface.co/docs/transformers/main/en/training) the model from Hugging Face's SDK,

```python
tokenizer = AutoTokenizer.from_pretrained(
    model_name_or_path,
    use_fast=True,
)
# 'use_fast' ensure that we use fast tokenizers (backed by Rust)
# from the 🤗 Tokenizers library.

model = AutoModelForSequenceClassification.from_pretrained(
    model_name_or_path, num_labels=len(label_list)
)
```

```bash
# Upload from local to Cloud Storage bucket
gsutil cp local/to/file file/on/bucket
# validate
gsutil ls -l file/on/bucket
```

```python
# Init the vertex ai sdk
aiplatform.init(project=PROJECT_ID, staging_bucket=BUCKET_NAME, location=REGION)
```

```python
# Check the healthy of the container just created
!curl http://localhost:7080/ping
# The port and "/ping" are defined manually in the Dockerfile
# You have to wait ~1 minute after creating successfully the container to run this line
```

::: warning

Make sure to add `location=REGION` where your project locates. You should make this region/location be the same across the services (buckets, workbench, compute engine, registry,...)

:::

For other tasks: creating docker container + test locally,..., let's read [the notebook](https://github.com/dinhanhthi/google-vertex-ai/blob/main/VIEW_ONLY_pytorch_text_classification_using_vertex_sdk_and_gcloud/VIEW_ONLY_pytorch-text-classification-vertex-ai-train-tune-deploy.ipynb).

{% endhsbox %}

### Just deploying?

In case you ==skip the training phase== and just use the model given by Hugging Face community.

👉 [Notebook](https://github.com/dinhanhthi/google-vertex-ai/blob/main/deploy-predict-container-to-vertex/2022_04_05_Thi_transformer_playground.ipynb) for testing load/use models from Hugging Face.
👉 [Notebook](https://github.com/dinhanhthi/google-vertex-ai/blob/main/deploy-predict-container-to-vertex/2022-05-05-Thi-vertex-ai-make-prediction.ipynb) for creating an image and deploying to vertex AI.

{% hsbox "Convert model from HF to Tensorflow's SavedModel format" %}

👉 [Export Transformers Models](https://huggingface.co/docs/transformers/main/en/serialization#export-transformers-models)

I use [the idea given in this blog](https://towardsdatascience.com/use-pre-trained-huggingface-models-in-tensorflow-serving-d2761f7e69f6).

```python
from transformers import TFAutoModelForSequenceClassification
MAX_SEQ_LEN = 100
callable = tf.function(tf_model.call)
concrete_function = callable.get_concrete_function([tf.TensorSpec([None, MAX_SEQ_LEN], tf.int32, name="input_ids"), tf.TensorSpec([None, MAX_SEQ_LEN], tf.int32, name="attention_mask")])
tf_model = TFAutoModelForSequenceClassification.from_pretrained("joeddav/xlm-roberta-large-xnli")
tf_model.save(data_loc + '/xlm-roberta-large-xnli', signatures=concrete_function)
```

```python
# Upload to bucket
! gsutil cp -r $modelPath $BUCKET_NAME
```

{% endhsbox %}

To make some tests with `curl`, check [this note](/curl-rest-api/). Below a shortcodes,

```python
instance = b"Who are you voting for in 2020?"
b64_encoded = base64.b64encode(instance)
test_instance = {
    "instances": [
        {
            "data": {
                "b64": b64_encoded.decode('utf-8')
            },
            "labels": ["Europe", "public health", "politics"]
        }
    ]
}

payload = json.dumps(test_instance)
r = requests.post(
    f"http://localhost:7080/predictions/{APP_NAME}/",
    headers={"Content-Type": "application/json", "charset": "utf-8"},
    data=payload
)

r.json()
```



### Using Transformers' `pipeline` with Vertex AI?

👉 [Transformers' `pipeline`](https://huggingface.co/docs/transformers/main/main_classes/pipelines#transformers.ZeroShotClassificationPipeline)

You can check a full example in [this notebook](https://github.com/dinhanhthi/google-vertex-ai/blob/main/deploy-predict-container-to-vertex/2022-05-05-Thi-vertex-ai-make-prediction.ipynb). In this section, I note about the use of Transformers' `pipeline` using `TorchServe` and Vertex AI.

The principle idea focuses on the file [`custom_hanler.py`](https://github.com/dinhanhthi/google-vertex-ai/blob/main/deploy-predict-container-to-vertex/custom_handler.py) which is used with `TorchServe` when creating a new container image for serving the model.

In this [`custom_handler.py`](https://github.com/dinhanhthi/google-vertex-ai/blob/main/deploy-predict-container-to-vertex/custom_handler.py) file, we have to create methods `initialize()`, `preprocess()`, `inference()`  which extend the class [`BaseHandler`](https://pytorch.org/serve/api/ts.torch_handler.html#module-ts.torch_handler.base_handler). Most of the problems come from the format of the outputs in these methods.

For using `pipeline()`, we can define `initialze()`, `preprocess()` and `inference()` like below,

::: hsbox Show the codes

```python
def initialize(self, ctx):
  """ Loads the model.pt file and initialized the model object.
      Instantiates Tokenizer for preprocessor to use
      Loads labels to name mapping file for post-processing inference response
  """
  self.manifest = ctx.manifest

  properties = ctx.system_properties
  model_dir = properties.get("model_dir")
  self.device = torch.device("cuda:" + str(properties.get("gpu_id")) if torch.cuda.is_available() else "cpu")

  # Read model serialize/pt file
  serialized_file = self.manifest["model"]["serializedFile"]
  model_pt_path = os.path.join(model_dir, serialized_file)
  if not os.path.isfile(model_pt_path):
    raise RuntimeError("Missing the model.pt or pytorch_model.bin file")

  # Load model
  self.model = AutoModelForSequenceClassification.from_pretrained(model_dir)
  self.model.to(self.device)
  self.model.eval()

  # Ensure to use the same tokenizer used during training
  self.tokenizer = AutoTokenizer.from_pretrained(model_dir)

  # pipeline()
  # We should create this pipe here in order to not creating again and again for each
  # request
  self.pipe = pipeline(task='zero-shot-classification', model=self.model, tokenizer=self.tokenizer)

  self.initialized = True
```

```python
def preprocess(self, data):
  """ Preprocessing input request by tokenizing
      Extend with your own preprocessing steps as needed
  """
  text = data[0].get("data")

  if text is None:
    text = data[0].get("body")

  sentences = text.decode('utf-8')

  # Tokenize the texts
  tokenizer_args = ((sentences,))
  inputs = self.tokenizer(*tokenizer_args,
                          padding='max_length',
                          max_length=128,
                          truncation=True,
                          return_tensors = "pt")
  return inputs
```

```python
def inference(self, inputs):
  """ Predict the class of a text using a trained transformer model.
  """
  decoded_text = self.tokenizer.decode(inputs["input_ids"][0], skip_special_tokens=True)
  prediction = self.pipe(decoded_text, candidate_labels=["negative", "neutral", "positive"])
  return [prediction] # YES, A LIST HERE!!!!
```

Another way to define `preprocess()` and the corresponding `inference()` (thanks to [this idea](https://github.com/cceyda/lit-NER/blob/master/lit_ner/serve.py)).

```python
def preprocess(self, data):
  """ Preprocessing input request by tokenizing
      Extend with your own preprocessing steps as needed
  """
  text = data[0].get("data")
  if text is None:
    text = data[0].get("body")
  sentences = text.decode('utf-8')

  processed_sentences = []
  num_separated = [s.strip() for s in re.split("(\d+)", sentences)]
  digit_processed = " ".join(num_separated)
  processed_sentences.append(digit_processed)

  return processed_sentences
```

```python
def inference(self, inputs):
  """ Predict the class of a text using a trained transformer model.
  """
  prediction = self.pipe(inputs[0], candidate_labels=["negative", "neutral", "positive"])
  if len(inputs) == 1:
    prediction = [prediction]
  return prediction # YES, IT'S ALREADY A LIST FROM preprocess()
```

:::

### Encode example text in `base64` format

For online prediction requestion, fortmat the prediction input instances as JSON with `base64` encoding as shown here:

```json
[
  {
    "data": {
      "b64": "<base64 encoded string>"
    }
  }
]
```

👉 [Converting a text to `base64` online](https://www.base64encode.org/).

{% hsbox "In case you wanna use Python" %}
```python
import base64
```

```python
# Without non-ascii characters
instance = b"This film is not so good as it is."
b64_encoded = base64.b64encode(instance)
print(b64_encoded)
# b'VGhpcyBmaWxtIGlzIG5vdCBzbyBnb29kIGFzIGl0IGlzLg=='
```

[What is `b`?](https://stackoverflow.com/questions/6269765/what-does-the-b-character-do-in-front-of-a-string-literal)

```python
# With (and also with) non-ascii characters (like Vietnamese, Russian,...)
instance = "Bạn sẽ bầu cho ai trong năm 2020?"
b64_encoded = base64.b64encode(bytes(instance, "utf-8"))
print(b64_encoded)
# b'QuG6oW4gc+G6vSBi4bqndSBjaG8gYWkgdHJvbmcgbsSDbSAyMDIwPw=='

b64_encoded.decode('utf-8')
# 'QuG6oW4gc+G6vSBi4bqndSBjaG8gYWkgdHJvbmcgbsSDbSAyMDIwPw=='

# To decode?
base64.b64decode(b64_encoded).decode("utf-8", "ignore")
# 'Bạn sẽ bầu cho ai trong năm 2020?'
```
{% endhsbox %}

### Testing created endpoint

::: hsbox REST with `curl`

Below codes are in Jupyter notebook.

```python
ENDPOINT_ID="<id-if-endpoint>"
PROJECT_ID="<project-id>"
```

```python
test_instance = {
    "instances": [
        {
            "data": {
                "b64": b64_encoded.decode('utf-8')
            },
            "labels": ["positive", "negative", "neutral"]
        }
    ]
}
payload = json.dumps(test_instance)
# '{"instances": [{"data": {"b64": "VGhpcyBmaWxtIGlzIG5vdCBzbyBnb29kIGFzIGl0IGlzIQ=="}, "labels": ["positive", "negative", "neutral"]}]}'
```

```python
%%bash -s $PROJECT_ID $ENDPOINT_ID

PROJECT_ID=$1
ENDPOINT_ID=$2

curl \
-X POST \
-H "Authorization: Bearer $(gcloud auth print-access-token)" \
-H "Content-Type: application/json" \
https://europe-west1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/europe-west1/endpoints/${ENDPOINT_ID}:predict \
-d '{"instances": [{"data": {"b64": "VGhpcyBmaWxtIGlzIG5vdCBzbyBnb29kIGFzIGl0IGlzIQ=="}, "labels": ["positive", "negative", "neutral"]}]}'
```

:::

::: hsbox Return

```bash
{
  "predictions": [
    {
      "scores": [
        0.92624515295028687,
        0.04236096516251564,
        0.031393911689519882
      ],
      "labels": [
        "negative",
        "positive",
        "neutral"
      ],
      "sequence": "This film is not so good as it is!"
    }
  ],
  "deployedModelId": "***",
  "model": "projects/***/locations/europe-west1/models/***",
  "modelDisplayName": "***"
}
```

:::

::: hsbox NodeJS Client (This one isn't mentioned in the official documentation)

👉 My repo: [dinhanhthi/google-api-playground](https://github.com/dinhanhthi/google-api-playground/tree/main/vertex-ai)
👉 Note: [Google APIs](/google-dialogflow-api/)

First, you have to create a Service Account (You can take the one you use to work with Vertex at the beginning, for me, it's "Compute Engine default service account").

Next, you have to create and download a JSON key w.r.t this Service Account.

```js
// File .env
PRIVATE_KEY = "***"
CLIENT_EMAIL = "***"
```

```js
// File predict.js
import { PredictionServiceClient, helpers } from "@google-cloud/aiplatform";

const credentials = {
  private_key: process.env.PRIVATE_KEY
  client_email: process.env.CLIENT_EMAIL
}

const projectId = "***";
const location = "europe-west1";
const endpointId = "***";

async function main(text = "I love you so much!") {
  const clientOptions = {
    credentials,
    apiEndpoint: `${location}-aiplatform.googleapis.com`,
  };

  const predictionServiceClient = new PredictionServiceClient(clientOptions);
  const endpoint = `projects/${projectId}/locations/${location}/endpoints/${endpointId}`;
  const parameters = {
    structValue: {
      fields: {},
    },
  };

  const buff = new Buffer.from(text);
  const base64encoded = buff.toString("base64");
  const _instances = {
    data: { b64: base64encoded },
  };
  const instance = {
    structValue: {
      fields: {
        data: {
          structValue: {
            fields: { b64: { stringValue: _instances.data.b64 } },
          },
        },
      },
    },
  };
  const instances = [instance];

  const request = { endpoint, instances, parameters };
  const [response] = await predictionServiceClient.predict(request);

  console.log("Predict custom trained model response");
  console.log(`Deployed model id : ${response.deployedModelId}`);
  const predictions = response.predictions;
  console.log("Predictions :");
  for (const prediction of predictions) {
    const decodedPrediction = helpers.fromValue(prediction);
    console.log(`- Prediction : ${JSON.stringify(decodedPrediction)}`);
  }
}

process.on("unhandledRejection", (err) => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
```

Then run the test,

```bash
node -r dotenv/config vertex-ai/predict.js "text to be predicted"
```

The results,

```bash
Predict custom trained model response
Deployed model id : 3551950323297812480
Predictions :
- Prediction : {"scores":[0.9942014217376709,0.0030435377266258,0.002755066612735391],"sequence":"You aren't kind, i hate you.","labels":["negative","neutral","positive"]}
```



Below are some links which may be useful for you,

- [google.cloud.aiplatform.v1.schema.predict.instance](https://cloud.google.com/vertex-ai/docs/reference/rpc/google.cloud.aiplatform.v1/schema/predict.instance)
- [Vertex AI NodeJS Reference](https://cloud.google.com/nodejs/docs/reference/aiplatform/latest/aiplatform/v1.predictionserviceclient#_google_cloud_aiplatform_v1_PredictionServiceClient_predict_member_1_)
- [Package google.protobuf | Protocol Buffers | Google Developers](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf)
- [Official examples on Github](https://github.com/googleapis/nodejs-ai-platform/blob/main/samples/predict-custom-trained-model.js)

:::



### Some remarks for Hugging Face's things

::: hsbox Encode and decode tokenizer

**Without** option `return_tensors` when encoding

```python
tokenizer = AutoTokenizer.from_pretrained(pt_model_dir)
inputs = saved_tokenizer("I am happy")

tokenizer.decode(inputs["input_ids"], skip_special_tokens=True)
```

**With** option `return_tensors` when encoding

```python
tokenizer = AutoTokenizer.from_pretrained(pt_model_dir)
inputs = saved_tokenizer("I am happy", return_tensors="pt")
# "pt" for "pytorch", "tf" for "tensorflow"

tokenizer.decode(inputs["input_ids"][0], skip_special_tokens=True)
```

:::

## Choose the same locations{:#same-locations}

👉 [Vertex locations](https://cloud.google.com/vertex-ai/docs/general/locations) (You can check all supported locations here)

Below are some codes where you have to indicate the location on which your service will be run (__Remark__: They're not all, just what I've met from [these notebooks](https://github.com/dinhanhthi/google-vertex-ai)),

::: hsbox Click to show

```bash
# When working with notebooks
# (You can choose it visually on the Vertex Platform)
gcloud notebooks instances ... --location=us-central1-a ...
```

```python
# When initialize the vertex ai sdk
aiplatform.init(project=PROJECT_ID, staging_bucket=BUCKET_NAME, location=REGION)
```

When pushing the image to the Container Registry, check [this link](https://cloud.google.com/container-registry/docs/pushing-and-pulling) for the right locations. For example, `gcr.io` or `us.gcr.io` is for US, `eu.gcr.io` is for EU, `asia.gcr.io` is for Asia.

:::



{% hsbox "In case you push to a wrong location for Container Registry" %}

1. Delete the model corresponding to this image. Go to [this link](https://console.cloud.google.com/vertex-ai/models).
2. Delete the bucket corresponding to this image. Go to [this link](https://console.cloud.google.com/storage).
3. Delete the image. Go to [this link](https://console.cloud.google.com/gcr/images).

{% endhsbox %}

## Container Registry to Artifact Registry

**Step 1**: Artivate Artifact Registry API.

**Step 2**: Go to [Artifacet Registry](https://console.cloud.google.com/artifacts). If you see any warning like "*You have gcr.io repositories in Container Registry. Create gcr.io repositories in Artifact Registry?", click **CREATE GCR. REPOSITORIES**.

**Step 3**: Copy images from Container Registry to Artifact Registry. What you need is the URLs of "from" CR and "to" AR.

- Check in page AR, there is small warning icon ⚠️, hover it to see the "not complete" url. Example: *Copy your images from `eu.gcr.io/ideta-ml-thi` to `europe-docker.pkg.dev/ideta-ml-thi/eu.gcr.io`*
- Check in page CR, click the button copy, a full url of the image will be copied to clipboard, eg. *gcr.io/ideta-ml-thi/pt-xlm-roberta-large-xnli_3*
- Finally, combine them with the tag (use `:lastest` if you don't have others already).
- Example, from `gcr.io/ideta-ml-thi/pt-xlm-roberta-large-xnli_3:latest` to `us-docker.pkg.dev/ideta-ml-thi/gcr.io/pt-xlm-roberta-large-xnli_3:latest`.

👉 [Transitioning to repositories with gcr.io domain support](https://cloud.google.com/artifact-registry/docs/transition/setup-gcr-repo) (also on this link, [copy from container to artifact](https://cloud.google.com/artifact-registry/docs/transition/setup-gcr-repo?authuser=2&_ga=2.126103373.-1545638870.1642178012#copy))

::: hsbox If you use `gcrane` (this tool is recommended by Google)

Next, [install `gcrane` tool](https://github.com/google/go-containerregistry/tree/main/cmd/gcrane). (It uses "go"). In case you just want to use directly, you can [download it](https://github.com/google/go-containerregistry/releases/tag/v0.9.0), then put it in the `$PATH` in your `.bashrc` or `.zshrc`. On MacOS, don't forget to go to System Preferences > Securitty & Privacy > Run it anyway.

Finally,[Read this official guide](https://cloud.google.com/artifact-registry/docs/docker/copy-from-gcr?authuser=2#copy-gcrane).

:::


::: hsbox If you use `gcloud`

**Good practice**: Use Cloud Shell instead.

```bash
# Change to the current project with gcloud
gcloud config set project <project-id>
```

👉 Follow [this official guide](https://cloud.google.com/artifact-registry/docs/docker/copy-from-gcr?authuser=2#copy-gcloud).

```bash
gcloud container images add-tag gcr.io/ideta-ml-thi/name-of-image:latest us-docker.pkg.dev/ideta-ml-thi/gcr.io/name-of-image:latest
```

**Remark**: It takes a long time to run in background. ==Don't close the terminal window!!== That's why we should (or shouldn't?) try Cloud Shell instead.

:::

**Step 4**: Route to AR (After step 3, the iamges in AR has the same route as in CR but the traffic only regconize it from CR. We need this step to make all traffics use AR's instead). You need [these permissions](https://cloud.google.com/artifact-registry/docs/transition/setup-gcr-repo?authuser=2&_ga=2.36757728.-1545638870.1642178012#redirect-enable) to perform the action (click the button ROUTE TO ARTIFACT).

## Problems?

::: hsbox 429 Rate of traffic exceeds capacity. Ramp your traffic up more slowly.

I met this problem when my model is around 2.5GB but it's ok for the model around 500MB.

__Solution__: When creating a new endpoint, set "Maximum number of compute nodes" to a number (don't leave it empty) and also choose a more powerful "Machine type".

:::

