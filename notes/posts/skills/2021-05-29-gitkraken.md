---
layout: post
title: "Gitkraken"
tags: [Skills, Git]
toc: true
icon: "/img/header/gitkraken.svg"
notfull: 1
keywords: "git github private account ssh different profiles git client token ideta generate gitkraken kraken"
---

👉 Note: [SSH](/ssh/).
👉 Note: [Git](/git/).
👉 Note: [Github](/github/).

## Check history of a file

[[Ctrl]] + [[P]] > Type "History" > Enter the file path.

## Merge / Rebase

If you wanna "merge" (rebase style) `branch_1` to `branch_2`, just drag and drop `branch_2` to `branch_1` and choose the option "Rebase branch_2 onto branch_1". It will merge commits from `branch_1` to `branch_2` step by step and put the "new" commit on `branch_2` **onto** the top of merged commits from `branch_1`.

``` bash
branch_1: A -- B -- C -- D -- E
branch_2: A -- F -- G -- H

# After rebasing (branch_2 onto branch_1)
branch_1: unchanges
branch_2: A -- B -- C -- D -- E -- F -- G -- H
```

## Connect to a private account?

1. Sign in with any account in GK.
2. Add new profile (with private acc)
3. Click on **Integrations** => Connect to private account & Generate a new SSH token.
4. Refresh things to see the changes.

## Different profiles?

::: success
**Best practice**: Create and sign in with a Gitkraken account. Don't worry if you have use the option "sign in with Google", you can create with that email too. After sign in via email (not via google), you can create and connect different profiles with different github accounts.
:::

Suppose that we work with `me@dinhanhthi.com` (personal) and `thi@ideta.io` (working). There are personal repos and working repos.

1. Sign in to GK with ~~~any profile (suppose personal)~~~ Gitkraken account.
2. Make 2 different profiles (one for personal, one for working).
3. Connect to Github account in each profile (need to approve + generate a new SSH key for each). In case it automatically opens the same browser (with the same github account) for 2 different profiles, you can copy the URL and paste to another browser with a different github account.
4. Each profile will have a separated workspace.
5. Everytime choosing a profile, a new workspace with its repos will be loaded.

**If problems?** In case you cannot integrate automatically to different Github accounts in the same session of Gitkraken.

1. Keep integrate auto for 1 account.
2. [Create](/ssh/) a seprate SSH keys.
3. In the **Integrations** tab, link to the files created in previous step.
4. Clone projects by ssh url instead.

✳️ **thi-ideta** wants to push to **dinhanhthi** on some repo, besides add thi-ideta's public key to the SSH, dinhanhthi must add thi-ideta to the "Collaborators" of that repo!

## References

- [Gitkraken cheat sheet](https://www.gitkraken.com/downloads/gitkraken-git-gui-cheat-sheet.pdf).