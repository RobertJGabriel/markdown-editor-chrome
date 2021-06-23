import sites from '../scripts.babel/components/sites.js';

let historyData = [
	{
		id: 'test',
		url: 'http://spankbang.com',
		title: 'Batman'
	},
	{
		id: 'test',
		url: 'http://removemyporn.com',
		title: 'Batman'
	},
	{
		id: 'test',
		url: 'http://pornhub.com',
		title: 'Batman'
	},
	{
		id: 'test',
		url: 'http://robertgabriel.ninja',
		title: 'Batman'
	},
	{
		id: 'test',
		url: 'http://twitter.com',
		title: 'Batman'
	}
];

describe('Hide my porn', () => {
	it('Count list', () => {
		const TEST_RESULT = expect(sites.sites.length).toEqual(16545);
		return TEST_RESULT;
	});

	it('Check Value', () => {
		const TEST_RESULT = expect(sites.sites[2].url).toEqual(
			'http://spankbang.com/74qv/video/faketaxi+vic+summers'
		);
		return TEST_RESULT;
	});

	it('Check Value with array list', () => {
		let slimArray = sites.sites.map((obj) => {
			return obj.url;
		});

		const TEST_RESULT = expect(slimArray[2]).toEqual(
			'http://spankbang.com/74qv/video/faketaxi+vic+summers'
		);
		return TEST_RESULT;
	});

	it('Check Value of History', () => {
		let slimArray = sites.sites.map((obj) => {
			return obj.url;
		});

		const search = (text) =>
			historyData.filter(({ url }) => url.includes(text));

		let filteredObjects = [];

		slimArray.some((item) => {
			let result = search(item);

			if (result.length !== 0) {
				filteredObjects.push(result[result.length - 1]);
			}
		});

		const uniq = new Set(filteredObjects.map((e) => JSON.stringify(e)));

		const res = Array.from(uniq).map((e) => JSON.parse(e));

		const TEST_RESULT = expect(res[1].url).toEqual('http://pornhub.com');
		return TEST_RESULT;
	});
});
