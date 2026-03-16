const CONFIGURED_SITE_URL = "__SOURCEWAVE_SITE_URL__";
const DEFAULT_SITE_URL = "http://127.0.0.1:3000";

const createButton = document.getElementById("create-button");
const domainNode = document.getElementById("page-domain");
const urlNode = document.getElementById("page-url");
const statusNode = document.getElementById("status-message");

let activeTabUrl = "";

function resolveSiteUrl() {
  const candidate = CONFIGURED_SITE_URL.includes("__SOURCEWAVE_SITE_URL__")
    ? DEFAULT_SITE_URL
    : CONFIGURED_SITE_URL;

  return candidate.replace(/\/+$/, "");
}

function setStatus(message, state = "idle") {
  statusNode.textContent = message;
  statusNode.dataset.state = state;
}

function isSupportedUrl(url) {
  return /^https?:\/\//i.test(url);
}

function renderSource(url) {
  try {
    const parsedUrl = new URL(url);
    domainNode.textContent = parsedUrl.hostname;
    urlNode.textContent = parsedUrl.href;
  } catch {
    domainNode.textContent = "Current page unavailable";
    urlNode.textContent = url || "";
  }
}

async function loadActiveTab() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    activeTabUrl = tab?.url ?? "";
    renderSource(activeTabUrl);

    if (!activeTabUrl) {
      createButton.disabled = true;
      setStatus("Open a public webpage, then try again.", "error");
      return;
    }

    if (!isSupportedUrl(activeTabUrl)) {
      createButton.disabled = true;
      setStatus("Only public HTTP(S) pages are supported in this version.", "error");
      return;
    }

    createButton.disabled = false;
    setStatus("Ready to open Sourcewave Studio.");
  } catch (error) {
    createButton.disabled = true;
    setStatus(
      error instanceof Error ? error.message : "Unable to read the active tab right now.",
      "error",
    );
  }
}

async function openStudio() {
  if (!isSupportedUrl(activeTabUrl)) {
    setStatus("Open a public HTTP(S) page before creating a podcast.", "error");
    return;
  }

  const studioUrl = new URL("/studio", `${resolveSiteUrl()}/`);
  studioUrl.searchParams.set("source", activeTabUrl);
  studioUrl.searchParams.set("origin", "extension");

  createButton.disabled = true;
  setStatus("Opening Sourcewave Studio...");

  await chrome.tabs.create({ url: studioUrl.toString() });
  window.close();
}

createButton.addEventListener("click", () => {
  void openStudio();
});

void loadActiveTab();
