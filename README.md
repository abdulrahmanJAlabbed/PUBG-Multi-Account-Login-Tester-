# Automated Multi-Account Login Tester with Puppeteer

An advanced automation tool using **Puppeteer** with **Stealth Plugin** to test multiple login credentials, log successes and failures, and handle 2FA prompts. Designed to streamline and efficiently handle large volumes of account logins with support for proxies, resource optimization, and dynamic user-agent rotation.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- **Stealth Mode**: Uses Puppeteer Extra’s stealth plugin to prevent detection.
- **Proxy Support**: Integrates with external proxy providers to bypass restrictions.
- **Multi-Account Support**: Reads login credentials from a `.txt` file.
- **Advanced Logging**: Categorizes successful, 2FA-required, and failed logins in separate files.
- **Optimized Resource Usage**: Disables unnecessary assets (images, fonts) to speed up testing.
- **Dynamic User-Agent Rotation**: Emulates a range of devices and browsers.
- **Cache Management**: Clears cookies and cache between sessions to simulate fresh logins.
- **Dynamic Viewport Resizing**: Randomizes screen size per session to enhance stealth.

---

## Prerequisites

- **Node.js** (v14+ recommended)
- **Puppeteer Extra** with Stealth Plugin

To check if Node.js and npm are installed, run:
```bash
node -v
npm -v
