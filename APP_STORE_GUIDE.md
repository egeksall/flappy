# Complete Step-by-Step Guide: Publishing Flappy Bird Ultra to the Apple App Store

This guide walks you through every step to package your Phaser 3 game with **Capacitor** into a native iOS app, configure it in **Xcode**, and publish it to the **Apple App Store**.

---

## 📋 Prerequisites

1. **Mac computer with macOS** (required by Apple for building iOS apps with Xcode).
2. **Xcode** (Free from the Mac App Store).
3. **Apple Developer Account** (Enrolled at [developer.apple.com](https://developer.apple.com) - $99/year to publish to the public App Store).
4. **Node.js (v18+)** installed on your Mac.

---

## 🚀 Step 1: Transfer Project & Install Capacitor

On your Mac, open Terminal in this project directory:

```bash
# 1. Install Capacitor dependencies
npm install

# 2. Add iOS native platform
npx cap add ios
```

This creates an `ios/` folder containing a complete, native Xcode workspace (`ios/App/App.xcworkspace`).

---

## 🎨 Step 2: Generate App Icons & Splash Screen

Your project already has a high-resolution 1024x1024 App Store icon at `assets/icon.png`.

To automatically generate all required iOS icon sizes (iPhone, iPad, App Store 1024x1024):

```bash
# Install Capacitor Assets generator tool
npm install -g @capacitor/assets

# Generate all iOS icons and splash assets from assets/icon.png
npx capacitor-assets generate --ios --iconSource assets/icon.png
```

---

## ⚙️ Step 3: Configure iOS Project in Xcode

Open the native iOS project in Xcode:

```bash
npx cap open ios
```

Or open `ios/App/App.xcworkspace` directly in Xcode.

### A. Set Signing & Team
1. In Xcode's left sidebar, select the top-level **App** project.
2. Select the **App** target.
3. Open the **Signing & Capabilities** tab.
4. Check **Automatically manage signing**.
5. In **Team**, select your Apple Developer account team.
6. In **Bundle Identifier**, verify or set: `com.flappybird.ultra` (must match your App ID in App Store Connect).

### B. Lock Screen Orientation to Portrait
1. Go to the **General** tab.
2. Under **Deployment Info** → **Device Orientation**:
   - Check **Portrait** only.
   - Uncheck Landscape Left / Landscape Right.
3. Under **Status Bar Style**, select **Light Content** (or transparent).

### C. Verify Offline & WKWebView Performance
1. In `ios/App/App/capacitor.config.json` (already pre-configured):
   - `scrollEnabled: false` ensures the game canvas never scrolls or bounces.
   - `contentInset: always` ensures safe area alignment with iPhone notches and Dynamic Island.

---

## 🧪 Step 4: Test on Simulator & Physical iPhone

1. In the top bar of Xcode, choose an iPhone simulator (e.g., **iPhone 16 Pro**) or connect your physical iPhone via USB.
2. Press the **Play (Run)** button or press `Cmd + R`.
3. Test:
   - Tap flight responsiveness.
   - Web Audio chirp, chime, and impact sounds.
   - Skin switching & medal unlocks.
   - Game over reload.

---

## 🏪 Step 5: Prepare App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com).
2. Click **My Apps** → **+** → **New App**.
3. Fill in:
   - **Platforms**: iOS
   - **Name**: `Flappy Bird Ultra` (or your chosen unique game name)
   - **Primary Language**: English
   - **Bundle ID**: Select `com.flappybird.ultra` (created in your developer account)
   - **SKU**: `flappy-bird-ultra-01`
   - **User Access**: Full Access
4. Click **Create**.

---

## 📦 Step 6: Create Archive & Upload Build

In Xcode on your Mac:

1. In the top target selector, select **Any iOS Device (arm64)** (do not select a simulator).
2. Go to the top menu: **Product** → **Archive**.
3. Xcode will compile and package your release bundle.
4. When the **Organizer** window opens:
   - Select your build.
   - Click **Distribute App** (blue button).
   - Choose **App Store Connect** → **Upload**.
   - Keep default signing options and click **Next** → **Upload**.
5. Once uploaded, Apple's automated processing takes ~5–15 minutes.

---

## 👥 Step 7: TestFlight Internal / External Testing

1. In App Store Connect, navigate to the **TestFlight** tab.
2. Under **Internal Testing**, add yourself or team members to test on real iPhones immediately via the TestFlight app.
3. Under **External Testing**, you can invite public beta testers by email or public link.

---

## 🚀 Step 8: App Store Submission

In App Store Connect, go to the **App Store** tab:

1. **Screenshots**: Upload 3–5 portrait screenshots (you can use Xcode Simulator `Cmd + S` to save pixel-perfect 6.7" and 6.5" screenshots, and `assets/showcase.jpg` as reference).
2. **Promotional Text & Description**:
   > "Flappy Bird Ultra is an arcade endless flying game with crisp responsive physics, unlockable bird characters, medal achievements, and nostalgic sound design."
3. **Keywords**: `flappy bird, arcade, retro game, flying bird, tap game, offline game`
4. **App Privacy**: Select "Data Not Collected" (since the game saves high scores purely locally via LocalStorage and does not track personal data).
5. **Rating**: Complete the questionnaire (Age Rating: 4+).
6. **Build**: Select the uploaded build from Step 6.
7. Click **Add for Review** → **Submit to App Review**!

Apple reviews games usually within 24–48 hours. Once approved, your game goes live worldwide!
