chrome.browserAction.onClicked.addListener((activeTab) => {
	chrome.tabs.create({
		url: chrome.extension.getURL('index.html')
	});
});

// On install listeners
chrome.runtime.onInstalled.addListener((details, previousVersion) => {
	switch (details.reason) {
		case 'install':
			chrome.tabs.create({
				url: `https://www.coffeeandfun.com/#welcome`,
				active: false
			});
			break;

		case 'update':
			const THIS_VERSION = chrome.runtime.getManifest().version;
			const pastVersion = details.previousVersion;
			chrome.tabs.create({
				url: `https://www.coffeeandfun.com/#updates?p=${pastVersion}&to=${THIS_VERSION}`,
				active: false
			});

			break;
	}
});
