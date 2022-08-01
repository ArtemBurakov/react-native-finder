# react-native-finder

Finder is an application created for finding friends in real time around the globe. It's a fun app that obviously only works if you have friends who also use it.

## Screenshots
<p float="left">
  <img src="https://user-images.githubusercontent.com/59533626/182175834-513f27e9-c9af-47fe-8ef3-478527d1f08b.png" height="600" width="300">
  <img src="https://user-images.githubusercontent.com/59533626/182175843-6f1ea471-fd86-44c5-b7bb-f467244592bb.png" height="600" width="300">
  <img src="https://user-images.githubusercontent.com/59533626/182175849-b0534500-82e0-451a-9794-4f84bbc6010e.png" height="600" width="300">
  <img src="https://user-images.githubusercontent.com/59533626/182175857-d5f56cc6-8a74-468b-bd4e-639e8bff0dfd.png" height="600" width="300">
  <img src="https://user-images.githubusercontent.com/59533626/182175866-dda07aee-453d-4f35-8c32-b737e269c7b5.png" height="600" width="300">
</p>

## Features

- :rocket: Possibility of updating. This app is friendly for future improvements and has good potential.
- :dart: Precision. Always get the exact location of your friends.
- :busts_in_silhouette: The ability to manage a list of friends. For example, deleting or adding new friends.
- :earth_africa: With Finder, you can always see where your friend is and know his or her location instantly.

## Requirements

1. You will need Node, the React Native command line interface, a JDK, and Android Studio.
2. [node-js-finder REST API](https://github.com/ArtemBurakov/node-js-finder).
3. Сonfigured development environment.
4. Google Maps API keys.
5. Created Firebase account and linked Firebase to react-native-finder app.

## Getting started

### Installation

* Clone the project

```bash
  git clone https://github.com/ArtemBurakov/react-native-finder.git
```

* Go to the project directory

```bash
  cd react-native-finder
```

* Install dependencies

```bash
  npm install
```

* First, you will need to start Metro, the JavaScript bundler that ships with React Native. To start Metro, run `npx react-native start` inside your React Native project folder:

```bash
  npx react-native start
```

* Let Metro Bundler run in its own terminal. Open a new terminal inside your React Native project folder. Run the following:

> Before running your React Native app, make sure you've completed the configuration steps, the node-js-finder API server is running, and your React Native app's http requests are correct.

```bash
  // if you are running on android device
  npx react-native run-android

  // if you are running on ios device
  npx react-native run-ios
```

## Configuration

### 1. Node installation

Follow the [installation instructions for your Linux distribution](https://nodejs.org/en/download/package-manager/) to install Node 14 or newer.

### 2. Java Development Kit

React Native requires at least the version 8 of the Java SE Development Kit (JDK). You may download and install [OpenJDK](https://openjdk.org/) from [AdoptOpenJDK](https://adoptopenjdk.net/) or your system packager. You may also [Download and install Oracle JDK 14](https://www.oracle.com/java/technologies/downloads/) if desired.

### 3. node-js-finder REST API installation

To make this React Native application fully functional, I created a [node-js-finder REST API](https://github.com/ArtemBurakov/node-js-finder). How to setup node-js-finder REST API can be found [here](https://github.com/ArtemBurakov/node-js-finder).

For the application's server logic to work, you need to run the node-js-finder server on your machine or on a remote server. Once node-js-finder server is running, in React Native application change the axios http requests with your server url. Or if you are running node-js-finder server on your local network, you can use `localhost` or the IP address of your machine on your local network.

> The IP address of your machine can be found using the `ifconfig` command.

### 4. Setting up the development environment

Follow [this complete guide](https://reactnative.dev/docs/environment-setup) to install the build tools and all the necessary packages to start React Native development and run a React Native app on your device or emulator.

### 5. Generate and Enable Goolge Maps API keys

* Let's generate and enable the API Keys for Android and iOS Maps SDK. To get an API key:
  - Visit the [Google Cloud Platform Console](https://cloud.google.com/console/google/maps-apis/overview).
  - Click the project drop-down and select or create the project for which you want to add an API key.
  - Click the navigation menu button (top-left corner) and select **APIs & Services > Credentials**.
  - On the **Credentials** page, click **Create credentials > API key**. The **API key created** dialog displays your newly created API key.
  - Click **Close**. It will list the new API key on the **Credentials** page under **API keys**.

* Now we will have to enable the `Maps SDK for Android` and `Maps SDK for iOS` libraries. To do so:
  - Click the navigation menu button (top-left corner) and select **APIs & Services > Library**.
  - Look for **Maps SDK for Android** under the **Maps** section, and click it.
  - Click on the **Enable** button.
  - Follow the same step to enable **Maps SDK for iOS**.

* After we have successfully generated the key, we need to implement it in the application. You need to perform the following actions:
  - On the **Credentials** page copy your API key.
  - Paste your key in `AndroidManifest.xml` file, located in `react-native-finder/android/app/src/main`.

  ```bash
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="AIzaSyBn9dlvbhm6AMHGRHYAJo9U7r-9glryZ4g"/>   <- replace this key with your copied key
  <uses-library android:name="org.apache.http.legacy" android:required="false"/>
  ```

### 6. Firebase implementation

To start with Firebase visit [this page](https://cloud.google.com/firestore/docs/client/get-firebase) and follow provided steps there.

* After creating your Firebase app, you need to download the `google-services.json` file.
* Paste the downloaded file into the `react-native-finder/android/app` folder.
* Then follow [this guide](https://rnfirebase.io/) to complete Firebase implementation in React Native app.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.