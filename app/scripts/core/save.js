exports.settings = (value, message, trialDays = -1) => {
	chrome.storage.sync.set(
		{
			license: value
		},
		() => {
			console.log(`Value is set to ${value}`);
		}
	);

	chrome.storage.sync.set(
		{
			message
		},
		() => {
			console.log(`Value is set to ${message}`);
		}
	);

	chrome.storage.sync.set(
		{
			trial: 7 - trialDays
		},
		() => {
			console.log(`Value is set to ${trialDays}`);
		}
	);
};
