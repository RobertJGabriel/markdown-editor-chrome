let AXIOS = require('axios');
let save = require('./save');
let user = require('./user');
let moment = require('moment');

const LOCAL = false;


exports.licenseSave = (time, type = "NONE") => {
  if (time === null || time === undefined) {
    time == 7;
  }
  let object = {
    license: type,
    message: type,
    time: time
  };
  object.type = type;
  object.time = time;
  object.message = type;
  save.settings(null, type);
  return object;
};

exports.calculate = (endTime) => {

  let endDate = new Date(endTime * 1000);
  let stillInTrial = moment().isSameOrBefore(endDate);
  let type = null;
  console.log('Is Before End date.');
  console.log(stillInTrial);

  if (stillInTrial) {
    console.log('Free trial, still within trial period');
    type = 'trialing';
    save.settings(endDate, 'trialing');
  } else {
    if (LOCAL) {
      type = 'active';
      exports.licenseSave(null, 'active');
    } else {
      type = 'unpaid';
      exports.licenseSave(null, 'unpaid');
    }
  }
  let object = {
    license: type,
    message: type,
    time: endDate
  };
  return object;
}


exports.parise = (endTime, accessLevel) => {

  console.log(accessLevel);
  let time = endTime;
  let object = null;
  switch (accessLevel.toLowerCase()) {
    case 'active':
      console.log('Fully paid & properly licensed.');
      object = exports.licenseSave(null, 'active');
      break;
    case 'sign_in':
      console.log('Needs to sign into browser');
      object = exports.licenseSave(null, 'sign_in');
      break;
    case 'incomplete_expired':
      object = exports.licenseSave(null, 'incomplete_expired');
      break;
    case 'past_due':
      console.log('past_due');
      object = exports.licenseSave(null, 'past_due');
      break;
    case 'incomplete':
      console.log('incomplete');
      object = exports.licenseSave(null, 'incomplete');
      break;
    case 'unpaid':
      console.log('unpaid');
      object = exports.licenseSave(null, 'unpaid');
      break;
    case 'canceled':
      console.log('canceled');
      object = exports.licenseSave(null, 'canceled');
      break;
    case 'NONE':
      console.log('NONE');
      object = exports.licenseSave(null, 'NONE');
      break;

    case 'trialing':
      console.log('trialing');
      if (LOCAL) {
        console.log('trialing');
        object = exports.licenseSave(null, 'trialing');
      } else {
        object = exports.calculate(time);
      }
      break;
    default:
      console.log('NONE');
      object = exports.licenseSave(null, 'NONE');
  }

  return object;
}


let get = async () => {
  const email = await user.get();
  return new Promise((resolve, reject) => {
    if (email.length === 0 || email === undefined || email === null) {
      let object = exports.licenseSave(null, 'sign_in');
      resolve(object);
      return true;
    }
    const API = 'https://rerjk6ho03.execute-api.us-east-1.amazonaws.com/production';
    AXIOS.get(`${API}/api/payments/user?email=${email}`)
      .then(response => {
        // Everything is safe.
        if (response.status === 200 || response.statusText === 'OK') {
          // No email found. Create user or set as false
          if (response.data.found === false) {
            if (LOCAL) {
              let object = exports.licenseSave(null, 'active');
              resolve(object);
            } else {
              let object = exports.licenseSave(null, 'NONE');
              resolve(object);
            }
          }
          const stipeObject = response.data.data;

          // incomplete, incomplete_expired, trialing, active, past_due, canceled, or unpaid.
          if (stipeObject[0].hasOwnProperty('subscriptions') === false) {
            let object = exports.licenseSave(null, 'NONE');
            console.log('error');
            resolve(object);
          } else {

            if (stipeObject[0].subscriptions.total_count != 0) {
              const status = stipeObject[0].subscriptions.data[0].status;
              const endTime = stipeObject[0].subscriptions.data[0].trial_end;
              let x = exports.parise(endTime, status);
              resolve(x);
            } else {
              let object = exports.licenseSave(null, 'NONE');
              console.log('error');
              resolve(object);
            }

          }

        }
      }).catch(error => {
        console.log(error);
        console.table(error);
        let object = exports.licenseSave(null, 'NONE');
        resolve(object);
      });
  });
};

export {
  get
};