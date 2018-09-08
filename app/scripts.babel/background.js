const CWS_LICENSE_API_URL = 'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/';
const TRIAL_PERIOD_DAYS = 7;
let statusDiv;
let access_token;

chrome.browserAction.onClicked.addListener(activeTab => {
  chrome.tabs.create({
    url: chrome.extension.getURL('popup.html')
  });
});


function init() {
  getLicense();
}

/*****************************************************************************
 * Call to license server to request the license
 *****************************************************************************/

function getLicense() {
  xhrWithAuth('GET', CWS_LICENSE_API_URL + chrome.runtime.id, true, onLicenseFetched);
}

function onLicenseFetched(error, status, response) {
  response = JSON.parse(response);

  if (status === 200) {
    parseLicense(response);
  } else {
    save('NONE');

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
  if (license.result && license.accessLevel == 'FULL') {
    save('FULL');
  } else if (license.result && license.accessLevel == 'FREE_TRIAL') {
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