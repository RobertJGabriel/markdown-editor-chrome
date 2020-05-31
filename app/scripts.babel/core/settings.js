exports.uninstall = () => {
  chrome.runtime.setUninstallURL("https://www.removemyporn.com/survey");
};

let save = async (token, type) => {
  return new Promise((resolve, reject) => {
    let setting = {};
    setting[token] = type;
    chrome.storage.sync.set(setting);
    resolve(setting);
  });
};


export { save };
