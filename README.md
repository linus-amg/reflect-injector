# reflect-injector

## Module to inject reflect into your node process.

Example

```js
const reflectInjector = require('reflect-injector');

reflectInjector.initialize({
  email: 'your-reflect-account-email@provider.tld',
  password: 'your-reflect-account-password',
  instanceId: 'some-identifier-for-your-instance',
  readOnly: true
});

// From this moment onwards statistics will be sent to the reflect database, so you can view them in the reflect ui. Since `readOnly` is true, you won't be able to control this node instance from the reflect UI, you can only see data, but you cannot restart, modify the instance's code, trigger cpu profiling etc.

// If you need all those features, just run `initialize` without the readOnly: true option, and you all those features and more will be enabled automatically.
```
