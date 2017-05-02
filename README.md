# Musketeer
[![Build Status](https://travis-ci.org/martijndeh/musketeer.svg?branch=master)](https://travis-ci.org/martijndeh/musketeer)
[![Coverage Status](https://coveralls.io/repos/martijndeh/musketeer/badge.svg?branch=master&service=github)](https://coveralls.io/github/martijndeh/musketeer?branch=master)

A/B testing for Node.js.

```js
// Participate the user in the experiment.
const variant = await Musketeer.participate('MyFirstTest', userID, [
	'A',
	'B',
]);

// Convert the user.
await Musketeer.convert('MyFirstTest', userID);
```

## How does it work?

When you participate a user in an experiment, Musketeer assigns the user to one of the variants. If the user participated the experiment before, the user participates the same variant as before.

Every 8 hours (you can configure the precise timing) Musketeer analyses the conversions of your
variants and adjusts the traffic per variant based on it's success. The better a variant is performing, the more traffic it's getting. These
adjustments are based on the multi-armed bandit algorithm.

#### Musketeer#participate(experimentName, userID, variantValues | options)

- `experimentName` _String_ The name of the experiment.
- `userID` _Any_ The unique identifier of the user.
- `variantValues` _String[]_ A list of values per variant. Every variant is given a unique name starting at A, B, and so on.
- `options` _Object_ Either pass `variantValues` or `options`.
- `options.type` _String_ The type of the experiment. Either `bandit`, or `random`.
- `options.expiry=28_800` _String_ The expiry of the weights in seconds. This controls how often the weights are recalculated. Defaults to 8 hours. It's generally a good idea to set the expiry longer than the average conversion time of a user. For example, if it takes a user 1.5 days to convert you should set the expiry to at least 1.5 days.
- `options.variants` _Map&lt;String, String&gt;_ The variants per variant name. `{ A: 'This is the first variant.', B: 'This is the second variant.' }`.

Participates the user in the experiment and returns the value of the variant the user joined. If the user already participated the experiment, the already joined variant's value is returned.

This function returns a Promise and resolves with the variant's value.

**Example**
```js
const userID = 1;
const variant = await Musketeer.participate('MyFirstTest', userID, {
	type: 'bandit',
	expiry: 60 * 60 * 24,
	variants: {
		A: 'Click me!',
		B: 'Join for free',
	},
});

console.log(variant); // This either prints "Click me!" or "Join for free".
```

#### Musketeer#convert(experimentName, userID)

- `experimentName` _String_ The name of the experiment.
- `userID` _Any_ The unique identifier of the user.

Counts the user with `userID` as conversion if not already converted. If you call this function multiple times for the same user, the conversion is only counted once. If the user did not previously join the experiment, the conversion is **not** counted. This is by design and may change in the future.

This function returns a Promise and resolves with true if the conversions was counted, and false if the user was already converted or did not join the experiment.

**Example**
```js
const userID = 1;
await Musketeer.convert('MyFirstTest', userID);
```

#### Musketeer#info(experimentName)

- `experimentName` _String_ The name of the experiment.

Returns an experiment info object. This is useful to report the status of experiments.

This function returns a Promise which resolves the info object.

```js
const experiment = await Musketeer.info('MyFirstTest');

/*
{
	name: 'MyFirstTest',
	variants: {
		A: {
			participants: 100,
			conversions: 20,
			conversionRate: 0.2,
		},

		B: {
			participants: 100,
			conversions: 10,
			conversionRate: 0.1,
		},
	},
}
*/
```

### What's next

- Automatically declare a winning variant after a configurable time/conversion/significance/etc.
