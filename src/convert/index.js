export default class ConvertController {
	constructor(storage) {
		this.storage = storage;
	}

	convert(experimentName, userID) {
		return this.storage.addConversion(experimentName, userID);
	}
}
