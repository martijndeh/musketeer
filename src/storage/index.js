import url from 'url';
import assert from 'assert';

import RedisStorage from './redis/index.js';
import MemoryStorage from './memory/index.js';

export default class Storage {
	static create(connectionUrl) {
		if (!connectionUrl) {
			return new MemoryStorage();
		}

		const connectionObject = url.parse(connectionUrl);

		switch (connectionObject.protocol) {
			case 'redis:':
				return new RedisStorage(connectionUrl);

			default:
				throw new Error(`Musketeer.Storage#create(): Storage protocol "${connectionObject.protocol}" is unknown.`);
		}
	}
}
