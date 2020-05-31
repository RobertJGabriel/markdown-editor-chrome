let license = require("./core/license");
let settings = require("./core/settings");

let user = require("./core/user");

chrome.browserAction.onClicked.addListener(activeTab => {
  chrome.tabs.create({
    url: chrome.extension.getURL('index.html')
  });
});

// On install listeners
chrome.runtime.onInstalled.addListener((details, previousVersion) => {
  onInstall(details, previousVersion);
});

async function api(request) {

  if (request.app === "license") {
    var result = await license.get();
    return result;
  }
}



async function onInstall(details, previousVersion) {

  switch (details.reason) {
    case "install":
      settings.save("showUpdates", true);
      chrome.tabs.create({
        url: `https://www.coffeeandfun.com/#welcome?chrome=true`,
        active: false
      });
      break;

    case "update":

      const THIS_VERSION = chrome.runtime.getManifest().version;
      const pastVersion = details.previousVersion;
      chrome.tabs.create({
        url: `https://www.coffeeandfun.com/#updates?p=${pastVersion}&to=${THIS_VERSION}`,
        active: false
      });

      break;
  }
}

async function licenseGet() {
  var result = await license.get();
  return result;
}

/**
 * Server procedure for content script.
 * Receives a request containing three parameters:
 * @param  {} request
 * @param  {} sender
 * @param  {} sendResponse
 */
//Get message from content script
chrome.runtime.onMessage.addListener(function (arg, sender, sendResponse) {
  if (arg.app === "syncLicense") {
    licenseGet()
      .then(function (data) {
        sendResponse(data);
      })
      .catch(function (error) {
        sendResponse({});
      });
    return true;
  }




  if (arg.app === "email") {
    user
      .get()
      .then(function (data) {
        sendResponse(data);
      })
      .catch(function (error) {
        sendResponse("Not logged into Chrome");
      });
    return true;
  }


});

async function init() {

  api({
      app: "license"
    })
    .then(function (data) {
      settings.uninstall();
    })
    .catch(function (error) {
      console.log(error);
    });
}


init();