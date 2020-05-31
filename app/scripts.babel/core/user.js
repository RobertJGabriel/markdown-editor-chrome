let AXIOS = require("axios");

let get = async () => {
  return new Promise((resolve, reject) => {
    chrome.identity.getProfileUserInfo(info => {
      if (
        info.email !== null ||
        info.email !== undefined ||
        info.email !== ""
      ) {
        resolve(info.email);
      } else {
        resolve("empty");
      }
    });
  });
};

let check = async email => {
  return new Promise((resolve, reject) => {
    AXIOS
      .get(`https://app.removemyporn.com/check?email=${email}`)
      .then(response => {
        if (status === 200) {
          resolve(data);
        } else {
          reject({});
        }
      })
      .catch(error => {
        console.table(error);
        reject({});
      });
  });
};

export { get, check };
