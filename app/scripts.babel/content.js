const accessibility = {
  init: function () {
    this.checkStatus(); // Check if the check box is set.
  },

  checkStatus: function () {
    chrome.storage.local.get('license', license => {
      let paid = false;
      if (license.license == 'FULL') {
        paid = true;
      } else {
        paid = true;
      }

      chrome.storage.local.get('enabled', items => {
        console.log(items.enabled);
        // Check if any information it shouldnt be run on.
        items.enabled ? this.enableAccessibility(paid) : this.disableAccessibility()
      });
    });
  },

  disableAccessibility: function () {
    let elem = document.getElementById('accessibility');
    if (elem) { // available
      elem.parentNode.removeChild(elem);
      (document.head || document.documentElement)
      .removeChild(elem);
      reloadPage();
    }
  },
  enableAccessibility: function () {
    let style;
    style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.setAttribute('id', 'accessibility');

    style.href = chrome.extension.getURL('styles/style.css');

    (document.head || document.documentElement).appendChild(style);
  },
  reloadPage: function () {
    let code;
    chrome.tabs.getSelected(null, tab => {
      code = 'window.location.reload();';
      chrome.tabs.executeScript(tab.id, {
        code
      });
    });
  }
};

accessibility.init();