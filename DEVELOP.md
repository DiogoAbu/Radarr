## Clone the repo
  ```bash
  $ git clone https://github.com/LetsMakeApps/Radarr.git
  $ cd Radarr
  ```

## Install dependencies
  ```bash
  $ yarn
  ```

## Adjust packager IP at package.json
  ```
  ...
  "scripts": {
    "start": "set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.30&& react-native-scripts start",
    "start-unix": "REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.30 react-native-scripts start",
  ...
  ```

## Run
  ```bash
  yarn start
  ```
  Open it in the [Expo app](https://expo.io) on your phone to view it. It will reload if you save edits to your files, and you will see build errors and logs in the terminal.

## Add a feature

- We use the [OneFlow](http://endoflineblog.com/oneflow-a-git-branching-model-and-workflow) branching model

1. Make sure you're up-to-date with origin and has no unpublished commits
    ```
    git checkout master
    git pull origin master
    ```

2. Start a feature, as a Screen or Component *(-b === new branch)*
    ```bash
    git checkout -b feature/my-feature master
    ```

## Commit a feature

1. Stage files *(-A === all files)*
    ```bash
    git add -A
    ```

2. Commit with **helpful message** *(will output the commit hash)*
    ```bash
    git commit -m "Helpful message"
    ```
    If you messed up the **helpful message**, use amend to change the message without creating a new commit, the commit hash will change though.
    ```bash
    git commit --amend -m "Most helpful message"
    ```

3. Update the files and HEAD
    ```bash
    git checkout feature/my-feature
    ```

4. Checkout `master` and rebase `my-feature` changes with it (*-i is for interactive*)
    ```bash
    git rebase -i master
    OR
    git rebase master [commit hash]
    OR
    git rebase master feature/my-feature
    ```

5. Update the files and HEAD
    ```bash
    git checkout master
    ```

6. Merge `master` and `feature`
    ```bash
    git merge --ff-only feature/my-feature
    ```

7. Update the remote with branch `master`
    ```bash
    git push origin master
    ```

8. Remove `my-feature` branch
    ```bash
    git branch -d feature/my-feature
    ```

---
**In one go**
  ```bash
  git add -A
  git commit -m "Helpful message"
  git checkout feature/my-feature
  git rebase master feature/my-feature
  git checkout master
  git merge --ff-only feature/my-feature
  git push origin master
  git branch -d feature/my-feature
  ```
