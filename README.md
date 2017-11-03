# Unofficial offline-first Radarr iOS/Android Client
<img src=".github/screenshot-app.png" width="800">

## About
An offline-first app for [Radarr](https://github.com/Radarr/Radarr)

After you input the Radarr API details it will download *all* info from **Radarr** and keep in storage for **offline** use.

## Usage
Open the [Expo app](https://expo.io) and scan the [QR Code](https://expo.io/@diogoabu/radarr):

[<img src=".github/qrcode.png">](https://expo.io/@diogoabu/radarr)


## Issues
- **Images are not shown after download** ([react-native/issues/13316](https://github.com/facebook/react-native/issues/13316)).
  - Tap the last Icon on the Tab Bar and tap the Server widget to go back to the Server List and re-enter the Server.
  - On Android just tap the Back Button and re-enter the Server.

## Development

1. **Clone the repo**

  ```bash
  $ git clone https://github.com/LetsMakeApps/Radarr.git
  $ cd Radarr
  ```

2. **Install dependencies**

  ```bash
  $ yarn
  ```

3. **Adjust packager IP at package.json**

  ```
  "scripts": {
    "start": "set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.30&& react-native-scripts start",
    "start-unix": "REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.30 react-native-scripts start"
  ```

4. **Run**

  ```bash
  yarn start
  ```
  Open it in the [Expo app](https://expo.io) on your phone to view it. It will reload if you save edits to your files, and you will see build errors and logs in the terminal.

5. **Develop**

  - We use the [OneFlow](http://endoflineblog.com/oneflow-a-git-branching-model-and-workflow) branching model

  - Make sure you're up-to-date with origin and has no unpublished commits
    ```
    git checkout master
    git pull origin master
    ```

  - Start a feature, as a Screen or Component *(-b === new branch)*
    ```bash
    git checkout -b feature/my-feature master
    ```

  - Once you are done working on the feature, make sure you're up-to-date with origin and:

    - Stage files *(-A === all files)*
      ```bash
      git add -A
      ```

    - Commit with **helpful message** *(will output the commit hash)*
      ```bash
      git commit -m "Helpful message"
      ```

      - If you messed up the **helpful message**, use amend to change the message and not create a new commit, the commit hash will change though.
        ```bash
        git commit --amend -m "Most helpful message"
        ```

    - Update the files and HEAD
      ```bash
      git checkout feature/my-feature
      ```

    - Checkout `master` and rebase `my-feature` changes with it (*-i is for interactive*)
      ```bash
      git rebase -i master
      OR
      git rebase master [commit hash]
      OR
      git rebase master feature/my-feature
      ```

    - Update the files and HEAD
      ```bash
      git checkout master
      ```

    - Merge `master` and `feature`
      ```bash
      git merge --ff-only feature/my-feature
      ```

    - Update the remote with branch `master`
      ```bash
      git push origin master
      ```

    - Remove `my-feature` branch
      ```bash
      git branch -d feature/my-feature
      ```

    - In one go
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

---
This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).
