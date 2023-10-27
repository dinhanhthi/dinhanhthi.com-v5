---
layout: post
title: "Using one service account for multiple GCP projects"
tags: [API & Services, MLOps, Google]
toc: false
icon: gcp.svg
keywords: "google apis projects service accounts"
---

We want to use a service account (SA) of a project to manage this project and other projects too.

## Create projects

Go to [`console.cloud.google.com/cloud-resource-manager`](https://console.cloud.google.com/cloud-resource-manager) to add projects we want, let's say `aa-test-one`, `aa-test-two` and `aa-test-three`.



## Create a SA

On the page of `aa-test-one`, go to **APIs & Services** → **Credentials** → **Create Credentials** → **Service Account** → Give the neccessary information and grant this SA access to the project (eg. "Owner") → **Done**.

Copy the email of this SA, eg. `admin@aa-test-one.iam.gserviceaccount.com`.



# Granting access to other projects

Go to another project, let's say `aa-test-two`.

Navigate to **IAM and Admin** → **IAM** → **Grant Access** → Paste the email in previous step to the "New principals" & assign roles to this principal (eg. "Owner") → **Save**.
