import browser from "webextension-polyfill";

const regex = /([^,]+)/g;
async function saveAlias(alias: { [key: string]: string }) {
  let valid = true;

  for (const prop in alias) {
    if (!regex.test(alias[prop])) {
      valid = false;
      break;
    }
  }

  if (valid) {
    await browser.storage.local.set({ alias });
    return true;
  }

  return false;
}

async function getAlias() {
  const alias: { [key: string]: string } = await browser.storage.local.get(
    "alias"
  );
  return alias;
}
