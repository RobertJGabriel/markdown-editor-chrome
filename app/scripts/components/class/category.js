export default class Category {
	constructor(title, low) {
		this.title = title;
		this.favorite = localStorage.getItem(title.toLowerCase())
			? true
			: false; // Check if its a favioute in the local storage
		this.low = low;
	}
}
