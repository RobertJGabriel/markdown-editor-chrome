const CWS_LICENSE_API_URL = 'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/';
const TRIAL_PERIOD_DAYS = 5;
let access_token;
let license;
let contextMenuID;

chrome.browserAction.onClicked.addListener(activeTab => {
  chrome.tabs.create({
    url: chrome.extension.getURL('index.html')
  });
});


function init() {
  getLicense();
  contextMenuUpdate(true);
}

/*****************************************************************************
 * Call to license server to request the license
 *****************************************************************************/

function getLicense() {
  xhrWithAuth('GET', CWS_LICENSE_API_URL + 'ahmapmilbkfamljbpgphfndeemhnajme', true, onLicenseFetched);
}

function onLicenseFetched(error, status, response) {
  response = JSON.parse(response);
  console.log(status);
  console.table(response);
  console.table(error);
  if (status === 200) {
    parseLicense(response);
  } else {
    chrome.storage.sync.set({
      license: 'NONE'
    }, () => {
      console.log(`Value is set too ${value}`);
    });
  }
}

/*****************************************************************************
 * Parse the license and determine if the user should get a free trial
 *  - if license.accessLevel == 'FULL', they've paid for the app
 *  - if license.accessLevel == 'FREE_TRIAL' they haven't paid
 *    - If they've used the app for less than TRIAL_PERIOD_DAYS days, free trial
 *    - Otherwise, the free trial has expired
 *****************************************************************************/

function parseLicense(license) {
  let licenseStatus;
  let licenseStatusText;
  license = license.accessLevel;

  console.log(license);
  console.table(license);

  if (license === 'FULL') {
    save('FULL');
  } else if (license === 'FREE_TRIAL') {
    let daysAgoLicenseIssued = Date.now() - parseInt(license.createdTime, 10);
    daysAgoLicenseIssued = daysAgoLicenseIssued / 1000 / 60 / 60 / 24;
    if (daysAgoLicenseIssued <= TRIAL_PERIOD_DAYS) {
      save('TRIAL');
    } else {
      save('EXPIRED');
    }
  } else {
    save('NONE');
  }
}


function save(value) {
  chrome.storage.sync.set({
    license: value
  }, () => {
    console.log(`Value is set to ${value}`);
  });
}


/*****************************************************************************
 * Helper method for making authenticated requests
 *****************************************************************************/

// Helper Util for making authenticated XHRs
function xhrWithAuth(method, url, interactive, callback) {
  let retry = true;
  getToken();

  function getToken() {
    chrome.identity.getAuthToken({
      interactive
    }, token => {
      if (chrome.runtime.lastError) {
        callback(chrome.runtime.lastError);
        return;
      }
      access_token = token;
      requestStart();
    });
  }

  function requestStart() {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
    xhr.onload = requestComplete;
    xhr.send();
  }

  function requestComplete() {
    if (this.status == 401 && retry) {
      retry = false;
      chrome.identity.removeCachedAuthToken({
          token: access_token
        },
        getToken);
    } else {
      callback(null, this.status, this.response);
    }
  }
}


init();