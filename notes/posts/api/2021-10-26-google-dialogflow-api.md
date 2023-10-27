---
layout: post
title: "Google APIs"
tags: [API & Services, JavaScript, Google]
toc: true
icon: dialogflow.svg
keywords: "apis request http apis application programming interface dialogflow google sdk google cloud gcp apis credentials REST postman gapi gsi sign in with google new version service account endpoint location detect intent roles tokens IAM folder organization projects custom roles principals resource manage service usage"
date: 2022-03-23
---

{% assign img-url = '/img/post/api' %}

Google's documentation is like an ocean. It's not easy to find a right one to start. This note contains only basic things that I've already worked with. Try your own hand at Google's APIs will help you understand more.

👉 Github repo: [dinhanhthi/google-api-playground](https://github.com/dinhanhthi/google-api-playground)

::: info
💡 This note is mainly for Dialogflow APIs. However, I mention also the other services of Google.
:::

## Official documentation

{% hsbox "Click to show" %}

1. Dialogflow's [APIs & references](https://cloud.google.com/dialogflow/es/docs/reference) -- the root of all things.

   1. [All SDK NodeJS Client References](https://cloud.google.com/nodejs/docs/reference) (beautiful version)
   1. ~~[Node.js client library](https://cloud.google.com/dialogflow/es/docs/reference/libraries/nodejs)~~ [NodeJS reference](https://cloud.google.com/nodejs/docs/reference/dialogflow/latest/overview) -- wanna use ~~in a backend~~ with NodeJS?
      1. ~~[Dialogflow SDK Client Reference](https://googleapis.dev/nodejs/dialogflow/latest/index.html)~~ [This one](https://cloud.google.com/nodejs/docs/reference/dialogflow/latest/overview) is more beautiful.
      2. [googleapis/nodejs-dialogflow](https://github.com/googleapis/nodejs-dialogflow) -- Github repo.
         1. [Samples](https://github.com/googleapis/nodejs-dialogflow#samples) -- wanna run these? Step to [this section](#run-samples).
   2. [REST APIs](https://cloud.google.com/dialogflow/docs/reference/rest) -- wanna use `GET`, `POST`,...?

2. [Service endpoint](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2-overview#service-endpoint).

    ::: tip
    `us-dialogflow.googleapis.com` and `dialogflow.googleapis.com` are the same, so you can use `<location>-dialogflow.googleapis.com` in your codes.
    :::

3. [Available regions](https://cloud.google.com/dialogflow/es/docs/how/region#regions) (used in `locations`).

    ::: tip
    `<region>-dialogflow.googleapis.com` = endpoint.
    :::

4. [google/google-api-javascript-client](https://github.com/google/google-api-javascript-client) -- aka `gapi`. Github repo.

5. [Google APIs Explorer](https://developers.google.com/apis-explorer/). (REST)

6. [Google API Node.js Client](https://googleapis.dev/nodejs/googleapis/latest/) (SDK)

7. [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).

8. [Understand roles](https://cloud.google.com/iam/docs/understanding-roles?authuser=1&_ga=2.35673635.-287242851.1634158283#dialogflow-roles) -- If you decide to create a service account, you will need to assign a role to some users/emails. Each role has different rights to use your data.

{% endhsbox %}

## Some services

- **Dialogflow**: [SDK](https://cloud.google.com/nodejs/docs/reference/dialogflow/latest) ([other official site](https://googleapis.dev/nodejs/dialogflow/latest/v2.AgentsClient.html)) | [REST API](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2-overview)
- **Manage projects**: [Resource Manager SDK](https://cloud.google.com/nodejs/docs/reference/resource-manager/latest) ([other official site](https://googleapis.dev/nodejs/resource/latest/v3.ProjectsClient.html)) | [REST API](https://cloud.google.com/resource-manager/reference/rest)
  - **Note**: From version `2.0.0`, [`resource-manager`](https://github.com/googleapis/nodejs-resource-manager/releases) change the package to `@google-cloud/resource-manager`. And from version `3.0,0`, the "folder" was introduced!

- **Active API on some projects**: [Service Usage SDK](https://cloud.google.com/nodejs/docs/reference/service-usage/latest) | [REST API](https://cloud.google.com/service-usage/docs/reference/rest)
  - **Note**: APIs can only be activated for Projects, neither folder nor organization!


::: warning

When you use any NodeJS service, for example,

```jsx
const client = new library.SampleClient(opts?: ClientOptions);
```

The `opts` is [described here](https://github.com/googleapis/gax-nodejs/blob/main/client-libraries.md#creating-the-client-instance).

:::

## Wanna run the Node.js samples?{:#run-samples}

👉 Link of [all (dialogflow nodejs) samples on github](https://github.com/googleapis/nodejs-dialogflow#samples).

::: warning
The old version uses [`dialogflow`](https://www.npmjs.com/package/dialogflow) and [`@type/dialogflow`](https://www.npmjs.com/package/@types/dialogflow). The new version uses only one [`@google-cloud/dialogflow`](https://www.npmjs.com/package/@google-cloud/dialogflow)!
:::

::: hsbox Step by step
1. Create a folder, eg. `/home/thi/df-samples/`
2. If you come from [Dialogflow Console](https://dialogflow.cloud.google.com/#/agents) > choose an agent > click on the gear next to the its name > Click on "Project ID" to open Google Cloud Platform Console.
3. If you come from GCP Console, it's the same.
4. Follow [these steps](https://cloud.google.com/storage/docs/reference/libraries#setting_up_authentication) to generate a JSON key (you'll download a JSON file). Store your JSON file in `df-samples/credential.json`. **Note down** the *project_id*, we will use it later, eg. `project_abc`.
5. Run each time you wanna test `export GOOGLE_APPLICATION_CREDENTIALS="/home/thi/df-samples/credential.json"` OR save this line to `/home/thi/.bashrc` or `/home/thi/.zshrc` (if you [use ZSH](/terminal/#zsh-linux)) and then refresh the current terminal (with this method, you don't need to run again previous line).

    ::: info
    **Alternative**: You don't have to use system variable `GOOGLE_APPLICATION_CREDENTIALS` if you don't want. In `credential.json`, copy `private_key` and `client_email` and then use them as,

    ```js
    const client = new AgentsClient({
        credentials: { private_key, client_email }
    });
    ```
    :::

6. Go to `/df-samples/` and run `npm i @google-cloud/dialogflow`.
7. Try this [quickstart.js](https://github.com/googleapis/nodejs-dialogflow/blob/main/samples/quickstart.js).
8. On terminal, run

    ``` bash
    node quickstart.js project_abc
    ```

9.  Read carefully the content of each file in [samples](https://github.com/googleapis/nodejs-dialogflow/tree/main/samples), you have to put the corresponding inputs for the sample to work!
:::

::: hsbox Try something outside "samples"?
In case you wanna try something outside the files given in [samples](https://github.com/googleapis/nodejs-dialogflow/tree/main/samples). Check [this SDK](https://googleapis.dev/nodejs/dialogflow/latest/index.html). Suppose we wanna try this one -- [`AgentsClient.searchAgents()`](https://googleapis.dev/nodejs/dialogflow/4.5.0/v2.AgentsClient.html#searchAgents)

1. Make the same things in "Step by step". At step 7, create `search-agents.js` with the same content as [`samples/set-agent.js`](https://github.com/googleapis/nodejs-dialogflow/blob/main/samples/set-agent.js). We are going to change this file.
2. Read the [reference](https://googleapis.dev/nodejs/dialogflow/4.5.0/v2.AgentsClient.html#searchAgents), change the input. Here is [an example](https://gist.github.com/dinhanhthi/b40217eff2b938ffbfece82de8bb0907),
:::

::: hsbox Different locations?
The example in "Try something outside..." gives us an example of using different regions. Below are some remarks:

1. On [DF console](https://dialogflow.cloud.google.com/), you can create some agents in a different regions, default is `global` (or `us`).

2. On the Google's documentations, they don't mention about the usage of location. If they say `parent = "projects/-"`, we shoud use `parent = "projects/-" + "/locations/" + location` where `location` can be [one of "Region ID"](https://cloud.google.com/dialogflow/es/docs/how/region#regions).

3. Change also the endpoint, option `apiEndpoint` in [`AgentsClient`'s constructor](https://googleapis.dev/nodejs/dialogflow/latest/v2.AgentsClient.html), for example.

    ```js
    const client = new AgentsClient({
        apiEndpoint: location + "-dialogflow.googleapis.com",
    });
    ```

:::



::: warning
On SDK documentation, they don't mention about the location in the `parent` property. For example, they say "`parent` can be `projects/<Project ID or '-'>`", but you can add [the location information](https://cloud.google.com/dialogflow/es/docs/how/region#regions) inside it like that

```js
const parent = (location) => "projects/-" + "/locations/" + location;
```

:::



::: info
**You have to enable the Dialogflow API** in the current project. Other wise, we meet below problem.

```bash
7 PERMISSION_DENIED: Dialogflow API has not been used in project 284022294153 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/dialogflow.googleapis.com/overview?project=284022294153 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.
```

You can use [Service Usage](https://cloud.google.com/nodejs/docs/reference/service-usage/latest/service-usage/v1.serviceusageclient#_google_cloud_service_usage_v1_ServiceUsageClient_enableService_member_1_) to enable a service on some project programmatically or go to beflow url to active it visually,

```bash
https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview?project=<projectId>
```

:::



## Wanna try `gapi` (JS client)?

::: danger
Google has announced that [they will be discontinuing the Google Sign-In JavaScript Platform Library for web](https://developers.googleblog.com/2021/08/gsi-jsweb-deprecation.html). You will have to switch to using *Google Identity Services* (or [Sign In With Google](https://developers.google.com/identity/gsi/web/guides/client-library) or `gsi`). The old service will be **completely discontinued on March 31, 2023**.

``` html
<!-- OLD -->
<script src="https://apis.google.com/js/platform.js" async defer></script>

<!-- NEW -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
```
:::

What's this `gapi`? You can use it completely inside an HTML file without using any backend.

👉 [List of samples](https://github.com/google/google-api-javascript-client/tree/master/samples) (google apis javascript client).
👉 You have to use [REST API](https://cloud.google.com/dialogflow/es/docs/reference/rest) in this case.

::: info
💡 **Tip**: If you are using [VSCode](/visual-studio-code/), you can install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension to quickly create a server (port `5500` by default). Just click the button at the bottom right of the file and a website will appear.
:::

::: hsbox Step by step
1. For setting up, follow [these steps](https://console.developers.google.com/apis/library).
2. After that, you should obtain an `API_KEY` and an `CLIENT_ID`.
3. First, try [this sample](https://github.com/google/google-api-javascript-client/blob/master/samples/authSample.html).
4. Using something like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) and open `authSample.html`.
5. Make a test.

::: warning
- Make sure you create the "OAuth consent screen" before you create "OAuth 2.0 Client IDs". The "consent screen" is the popup window that contains all the information about the scopes your app will ask users for permission.
- Make sure you add `http://localhost:5500` (which is created in step 4) to "Authorized JavaScript origins" and "Authorized redirect URIs". You may have to wait a few "ten minutes" for everything to work. Without this step, you may encounter the error `mismatch_uri`.
:::

## The corresponding between REST API and Node.js clients

👉 [REST API](https://cloud.google.com/dialogflow/docs/reference/rest/v2-overview).
👉 [Node.js SDK](https://googleapis.dev/nodejs/dialogflow/latest/index.html).

::: hsbox The corresponding between references
`projects.agent.search`

- `GET https://{endpoint}/v2/{parent=projects/*}/agent:search`
- **REST**: [.../v2/projects.agent/search](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent/search)
- **SDK**: [.../v2.AgentsClient.html#searchAgents](https://googleapis.dev/nodejs/dialogflow/latest/v2.AgentsClient.html#searchAgents)

`projects.agent.sessions.detectIntent`

- `POST https://{endpoint}/v2/{session=projects/*/locations/*/agent/sessions/*}:detectIntent`
- **REST**: [.../v2/projects.agent.sessions/detectIntent](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.sessions/detectIntent)
- **SDK**: [.../v2.SessionsClient.html#detectIntent](https://googleapis.dev/nodejs/dialogflow/latest/v2.SessionsClient.html#detectIntent)

:::



::: warning

Sometimes, the location infotmation is mentionned in the REST API but not in the SDK. For example, load the list of agents w.r.t. [some location](https://cloud.google.com/dialogflow/es/docs/how/region#regions),

- **REST** (different with [the general case](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent/search)): https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.locations.agent/search

- **SDK** (the same as the general case), in this, we just need to add "location" into the `agent` property, like

  ```js
  const parent = (location) => "projects/-" + "/locations/" + location;
  ```

:::

## Using REST API in Node.js

- Normally, it's easier if we use [Node.js SDK](https://googleapis.dev/nodejs/dialogflow/latest/index.html).
- First, you need to create a Service Account, then create a key and download the JSON file. Follow [these steps](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account).
- Check [an example code](https://gist.github.com/dinhanhthi/e57e00886adaa611e2b49f9dcf76d90e).
- **Remark**: the code above use `request` which has been [already deprecated](https://www.npmjs.com/package/request)! You can choose [any alternative](https://github.com/request/request/issues/3143).

::: warning
**Remark**: With keys generated from a service account (stored in JSON), we can **only get 1 agent** for methods like [`projects.agent.search`](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent/search) although it says that we can get a list of agents. In this case, try to [get access token via OAuth 2.0](https://www.youtube.com/watch?v=Qt3KJZ2kQk0). With this, we can access to all projects instead of only 1 (which is used to generate the json file).
:::

## Dialogflow REST APIs with Postman

👉 [Check this official guide](https://github.com/GoogleCloudPlatform/dialogflow-integrations/blob/master/dialogflow-api-quick-start/postman/README.md).

:::hsbox Additional configurations
- Create a collection and add the Authorization for this collection. All of its request will use the same auth method.
- Create variables (on tab "Variables") to store "CLIENT ID" (`client_id`) and "CLIENT SECRET" (as `client_secret`), then use them in the form by `{% raw %}{{client_id}}{% endraw %}` and `{% raw %}{{client_secret}}{% endraw %}`.

:::

## Location problem

👉 [List of endpoints](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2-overview#rest_endpoints) (containing location inside).
👉 [LIst of location information](https://cloud.google.com/dialogflow/es/docs/how/region#regions) you can use with Dialogflow.

You have to use ==the same [endpoint](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2-overview#rest_endpoints) and [location information](https://cloud.google.com/dialogflow/es/docs/how/region#regions)== in the API/SDK. If you use them differently, for example,

```js
https://global-dialogflow.googleapis.com/v2/projects/-/locations/europe-west1/agent:search
```

You will meet an error like below,

```
"Please switch to 'europe-west1-dialogflow.googleapis.com' to access resources located in 'europe-west1'."
```

In the SDK documention, they don't mention about the location you need to use in the `agent` property. For example, they say "`parent` can be `projects/<Project ID or '-'>`", but you can add [the location information](https://cloud.google.com/dialogflow/es/docs/how/region#regions) inside it like that

```js
const parent = (location) => "projects/-" + "/locations/" + location;
```

💡They are the same (for [endpoints](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2-overview#rest_endpoints)):

```js
dialogflow.googleapis.com
us-dialogflow.googleapis.com
global-dialogflow.googleapis.com
```



## Custom roles

👉 [Create here](https://console.cloud.google.com/projectselector2/iam-admin/roles) (then you need to choose a project / a folder / an organization)
:point_right: [Understanding roles](https://cloud.google.com/iam/docs/understanding-roles).

- If you choose a project, there are some roles cannot be added because they belongs to folders/organization (eg. `resourcemanager.projects.list`)
- ([ref](https://console.cloud.google.com/cloud-setup/organization?organizationId=247943502148)) You have to pay (using *Google Workspace* or *Google Identity*) to create an organization or a folder.

::: tip

If you already have a domain, you can try to create a Google Workspace and use it in 1 month of trial. After that, you can deactivate the Google Workspace account but the things on the Google Cloud Platform are still there and the organization you have created in Google Workspace is still working!

:::

In case you wanna some tasks + don't wanna create a custom role (don't forget to check [this list](https://cloud.google.com/iam/docs/understanding-roles)):

::: hsbox Show the list

- **Create a new project**: *Project Creator* (Note: *Owner* doesn't have this role)
- **Delete a project**: *Project Deleter* (Note: *Owner* doesn't have this role)
- **Create a new folder**: *Folder Creator* (Note: *Organization Administrator* doesn't have this role, just list the folders and others)
- **List all projects** / folders: *Organization Administrator*
- **All Dialogflow tasks**: *Dialogflow API Admin* (it has `dialogflow.*`)
- Enable/Disable/List services in a project: *Service Usage Admin*

:::



## Service Account w.r.t Organization / Folder

:point_right: [Create a service account](https://console.cloud.google.com/iam-admin/serviceaccounts/create). (and also the key for it > then download the JSON file)

- By default, a service account can only access to the current project (even if you choose the roles which created in the organization/folder).
- If you want that service account can perform tasks in the organization/folder, you have to go to **IAM & Admin** > **IAM** > choose the organization / folder (yes, IAM is different for different project/organization/folder) > **ADD** > add the email of the service account to **New principals** and choose a role for it.



::: hsbox Step by step

1. You have to have a domain and full access to DNS.

2. Try 1 month free [Google Workspace](https://workspace.google.com/) (from this, you will have an organization in [GCP](https://console.cloud.google.com/)).  💡 **TIP**: After 1 month, you deactivate the subsription but the things on GCP witll work!

3. (You may need to activate again the subscription on GCP with a free 300$). Don't worry, just a test, you lose nothing from this amount.

4. Go to [IAM](https://console.cloud.google.com/iam-admin/iam), choose your organization > ADD > paste the admin email of your organization + set roles for it (*Organization Administrator*, *Owner*, *Folder Creator*). Without this step, you cannot create any folder/project.

5. Go to [Cloud Resource Manager](https://console.cloud.google.com/cloud-resource-manager) > Create a new folder inside your organization.

6. Go to [APIs & Services / Credentials](https://console.cloud.google.com/projectselector2/apis/credentials) > Choose a project > Create Credentials > Service Account > Filling the information > Create and continue > Done. **Don't forget to copy the email of this service account** > Click on the link of that SA > Keys > Add key > Create a new key > JSON > Download a JSON file to your computer.

7. Go to IAM again, this time, choose the fodler / organization you want above service account have the right to manage things > Add > Paste the email of the SA you created above > Set roles to it like *Owner, Organization Administrator, Dialogflow API Admin, Project Creator, Project Deleter, Service Usage Admin* (you can check the [list of all roles here](https://cloud.google.com/iam/docs/understanding-roles?_ga=2.200836974.-1507687642.1642666540#predefined_roles)). You can even create your own custom roles.

8. In order to created SA can use Resource Manager API, you have to activate it, otherwise, there will be an error like,

   ```bash
   7 PERMISSION_DENIED: Cloud Resource Manager API has not been used in project 1023630190150 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview?project=1023630190150 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.
   ```

   You either use the link given in the error or using,

   ```bash
   node -r dotenv/config service-usage/enableService.js 1023630190150 cloudresourcemanager.googleapis.com
   ```

   to activate the api.

8. One more thing, if you are going to use this SA to manage other APIs on other projects to which it's not belongs, you have to enable that service on the project it belongs to first. (For example, you created this SA on project-A and then you wanna use it to enable some Dialogflow APIs on project-B. You have to enable Dialogflow service on project-A first!)

9. Now, your SA has the full access you want.

10. On your computer, create a file `.env` withe the keys like in `env.example.txt`.

11. You're good!

:::



::: info

If you use SDK [`listProjectsAsync`](https://googleapis.dev/nodejs/resource/latest/v3.ProjectsClient.html#listProjectsAsync) to list all projects in the organization, you can only list the projects in that organization, not the ones inside a folder even if that folder belongs to the organization.

:::



::: tip

**Quota**: For each Service Account, ==the limit of number of projects you can create is 22==. You can ask more but the better idea is to create another service account (and don't forget to remove the old one with its credentials).

:::



## Types for TypeScript

::: warning
The old version uses [`dialogflow`](https://www.npmjs.com/package/dialogflow) and [`@type/dialogflow`](https://www.npmjs.com/package/@types/dialogflow). The new version uses only one [`@google-cloud/dialogflow`](https://www.npmjs.com/package/@google-cloud/dialogflow)!
:::

For example, the returned type for [`getAgent()`](https://cloud.google.com/nodejs/docs/reference/dialogflow/latest/dialogflow/v2beta1.agentsclient#_google_cloud_dialogflow_v2beta1_AgentsClient_getAgent_member_1_) method can be defined as,

```tsx
export type Agent = dialogflow.protos.google.cloud.dialogflow.v2.Agent;
```



## Play with Intents, Examples and Entities

🎯 **Aim**: Suppose that we want to create a new entities via API (including the system entities).

- [List all intents from some agent](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.intents/list): just put in the `parent` something like `projects/<projectId>/agent` and then click **Execute**. Don't forget to choose the `intentView` as `INTENT_VIEW_FULL` (without this one, you cannot see the examples or "trainingPhrases") 👈 Copy and remember the output of type `Intent`.
- Create a new entities using [this API](https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.intents/create). Again, put in `parent` as `projects/<projectId>/agnet` and then in the **Request body**, paste an object which looks like the output in the previous step (remember to remove "name" sections, this section will be created by DF), then **Execute**.

::: hsbox Example of `Intent`

```json
{
  "displayName": "testing system with examples",
  "priority": 500000,
  "trainingPhrases": [
    {
      "type": "EXAMPLE",
      "parts": [
        {
          "text": "I want to go "
        },
        {
          "text": "there",
          "entityType": "@sys.color",
          "alias": "color",
          "userDefined": true
        },
        {
          "text": " this thursday"
        }
      ]
    },
    {
      "type": "EXAMPLE",
      "parts": [
        {
          "text": "toi tên là "
        },
        {
          "text": "đinh anh thi",
          "entityType": "@thi",
          "alias": "thi",
          "userDefined": true
        }
      ]
    },
    {
      "type": "EXAMPLE",
      "parts": [
        {
          "text": "anh "
        },
        {
          "text": "thi dinh",
          "entityType": "@thi",
          "alias": "thi",
          "userDefined": true
        },
        {
          "text": ", it's me"
        }
      ]
    }
  ],
  "parameters": [
    {
      "name": "aa07d940-bcc7-464d-af4d-d38120737b9c",
      "displayName": "thi",
      "value": "$thi",
      "entityTypeDisplayName": "@thi"
    },
    {
      "name": "bde49cda-37d8-43c3-9461-83c2fbc90996",
      "displayName": "color",
      "value": "$color",
      "entityTypeDisplayName": "@sys.color"
    }
  ]
}
```

:::
