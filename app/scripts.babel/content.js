const openDyslexic = {
    init() {
        this.checkStatus(); // Check if the check box is set.
    },
    isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    },
    checkStatus() {

        const keysArray = [
            'license',
            'enabled',
            'font',
            'docs',
            'blacklist',
            'color',
            'fontColor'
        ];

        chrome.storage.sync.get(keysArray, setting => {

            let enabled = setting.enabled;
            let docs = setting.docs;
            let blacklist = '';
            let defaultFont = 'opendyslexic';
            if (this.isEmpty(setting.docs) === false) {
                docs = false;
            } else {
                docs = setting.docs;
            }

            if (this.isEmpty(setting.blacklist) === false) {
                let bannedUrls = setting.blacklist.split(',');
                bannedUrls = bannedUrls.filter(entry => entry.trim() != '')
                const host = window.location.host;
                blacklist = bannedUrls.some(word => {
                    word = word.replace(/(^\w+:|^)\/\//, '').trim();
                    return host.includes(word) || host.includes('www.' + word);
                });
            }

            if (this.isEmpty(setting.color) === false) {
                if (setting.color.trim() !== '') {
                    document.body.style.setProperty("background-color", setting.color, "important");
                }
            }

            if (this.isEmpty(setting.font) === false) {
                defaultFont = setting.font;
            }

            if (this.isEmpty(setting.fontColor) === false) {
                if (setting.fontColor.trim() !== '') {
                    document.body.style.setProperty("color", setting.fontColor, "important");
                }
            }

            if (blacklist === true) {

                openDyslexic.disableOpenDyslexic();
            } else {
                enabled ? openDyslexic.enableOpenDyslexic(docs, defaultFont) : openDyslexic.disableOpenDyslexic();
            }

        });
    },
    disableOpenDyslexic() {
        let elem = document.getElementById('helpebird');
        if (elem) { // available
            elem.parentNode.removeChild(elem);
            (document.head || document.documentElement)
            .removeChild(elem);
            openDyslexic.reloadPage();
        }
    },
    enableOpenDyslexic(paid, defaultFont) {
        let style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.setAttribute('id', 'helpebird');
        if (paid) {
            style.href = chrome.extension.getURL('styles/google-docs.css');
        } else {
            style.href = chrome.extension.getURL(`styles/${defaultFont.toLowerCase()}.css`);
        }
        document.head.appendChild(style);
        openDyslexic.reloadPage();
    },
    reloadPage() {
        chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        }, function (tabs) {
            // and use that tab to fill in out title and url
            const currentTab = tabs[0];
            const script = 'window.location.reload();';
            chrome.tabs.executeScript(currentTab.id, {
                code: script
            });
        });
    }
};

openDyslexic.init();