import ConvertController from '../index.js';
import sinon from 'sinon';
import assert from 'assert';

describe('ConvertController', () => {
	it('should call addConversion', async () => {
		const storage = {
			addConversion: sinon.spy(),
		};
		const convertController = new ConvertController(storage);

		const experimentName = 'Test';
		const userID = 1;

		await convertController.convert(experimentName, userID);

		assert.equal(storage.addConversion.callCount, 1);
	});
});
