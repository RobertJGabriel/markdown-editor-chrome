exports.open = () => {

    chrome.tabs.create({
        url: `notes.html`
    });

};


exports.save = (text, url) => {

    let QUERY = text.trim();

    if (QUERY.length === 0) {
        return;
    }

    const KEYS = ['notes', 'license', 'message'];

    chrome.storage.sync.get(KEYS, settings => {
        console.log(settings);
        let PAID = false;
        switch (settings.message.toLowerCase()) {
            case 'active':
                PAID = true;
                break;
            case 'incomplete_expired':
                PAID = false;
                console.log('incomplete_expired');
                break;
            case 'past_due':
                PAID = true;
                console.log('past_due');
                break;
            case 'incomplete':
                PAID = false;
                console.log('incomplete');
                break;
            case 'unpaid':
                PAID = false;
                console.log('unpaid');
                break;
            case 'canceled':
                PAID = false;
                console.log('canceled');
                break;
            case 'none':
                PAID = false;
                console.log('title_message_none');
                break;
            case 'trialing':
                PAID = true;
                break;
            default:
                PAID = false;
                console.log('title_message_fallback');


        }
        if (PAID) {
            const currentdate = new Date();
            const datetime = `${currentdate.getDate()}/${currentdate.getMonth() +
				1}/${currentdate.getFullYear()} @ ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;

            let result = [];
            if (settings.notes === null || settings.notes === undefined) {
                let object = {
                    date: datetime,
                    snip: 'Remember you can save any notes',
                    website: url,
                    folder: 'example'
                };
                result.push(object);
            } else {
                const currentData = JSON.parse(settings.notes);

                for (let x = 0; x < currentData.length; x++) {
                    result.push(currentData[x]);
                }
            }

            const object = {
                date: datetime,
                snip: QUERY,
                website: url,
                folder: 'web'
            };

            result.push(object);

            chrome.storage.sync.set({
                notes: JSON.stringify(result)
            });

            alert(chrome.i18n.getMessage('notifcations_notes_saved_title'));
            // var opt = {
            // 	type: 'basic',
            // 	title: chrome.i18n.getMessage('notifcations_notes_saved_title'),
            // 	message: chrome.i18n.getMessage('notifcations_notes_saved_body'),
            // 	iconUrl: chrome.runtime.getURL('images/logo/128.png')
            // };
            // notifications.show(opt, 'notes');
        } else {
            // Show banner to upgrade
            alert(chrome.i18n.getMessage('notifcations_upgrade_title'));
            // var opt = {
            // 	type: 'basic',
            // 	title: chrome.i18n.getMessage('notifcations_upgrade_title'),
            // 	message: chrome.i18n.getMessage('notifcations_upgrade_body'),
            // 	iconUrl: chrome.runtime.getURL('images/logo/128.png')
            // };
            // notifications.show(opt, 'upgrade');
        }

    });
};