const AXIOS = require('axios');
const TRIAL_PERIOD_DAYS = 7;
const CWS_LICENSE_API_URL = "https://www.googleapis.com/chromewebstore/v1.1/userlicenses/";
const LOCAL = false;
const CHROME_ID = 'dkpldbigkfcgpamifjimiejipmodkigk';
let version = 0;
let pastVersion = 0;




/*****************************************************************************
 * Call to license server to request the license
 *****************************************************************************/

function init() {
  getLicense();
}

function getLicense() {

  chrome.identity.getAuthToken({
    interactive: true
  }, function (token) {

    const CONFIG = {
      headers: {
        'Authorization': "Bearer " + token
      }
    };

    AXIOS.get(
        CWS_LICENSE_API_URL + CHROME_ID,
        CONFIG
      )
      .then(response => {
        console.table(response);
        // response.result == TRUE = User has license. FALSE = User does not have license.
        if (response.status === 200 && response.data.result === true) {
          pariseLicense(response.data, response.data.accessLevel);
        }

        if (response.data.result === false) {
          save(false, `FULL`);
        }

      })
      .then(response => {
        console.table(response);
        // Remove token
        chrome.identity.removeCachedAuthToken({
          token: token
        });
      })
      .catch(error => {
        console.table(error);
        save(false, `FULL`);
      });
  });
}


/**
 * @param  {} fullDetails
 * @param  {} accessLevel
 */
function pariseLicense(fullDetails, accessLevel) {
  switch (accessLevel) {
    case 'FULL':
      console.log('Fully paid & properly licensed.');
      save(true, 'FULL');
      break;
    case 'FREE_TRIAL':
      calculateTrial(fullDetails.createdTime, 'FREE_TRIAL');
      break;
    default:
      save(false, `FULL`);
  }
}


/**
 * @param  {} fullDetails
 * @param  {} accessLevel
 */
function calculateTrial(createdTime = 7, accessLevel) {

  let LICENSE_ISSUED_DAYS_AGO = Date.now() - parseInt(createdTime, 10);
  LICENSE_ISSUED_DAYS_AGO = LICENSE_ISSUED_DAYS_AGO / 1000 / 60 / 60 / 24;
  console.log('License issued');
  console.log(LICENSE_ISSUED_DAYS_AGO);

  if (LICENSE_ISSUED_DAYS_AGO <= TRIAL_PERIOD_DAYS) {

    console.log('Free trial, still within trial period');
    save(true, 'FULL', Math.round(LICENSE_ISSUED_DAYS_AGO));
  } else {
    save(false, 'FULL');
  }
}


/**
 * @param  {} value
 * @param  {} message
 */
function save(value, message, trialDays = -1) {
  chrome.storage.sync.set({
      license: value
    },
    () => {
      console.log(`Value is set to ${value}`)
    }
  );

  chrome.storage.sync.set({
      message: message
    },
    () => {
      console.log(`Value is set to ${message}`)
    }
  );


  chrome.storage.sync.set({
      trial: (7 - trialDays)
    },
    () => {
      console.log(`Value is set to ${trialDays}`)
    }
  );
}




init();

chrome.browserAction.onClicked.addListener(activeTab => {
  chrome.tabs.create({
    url: chrome.extension.getURL('index.html')
  });
});