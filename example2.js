const reflectInjector = require('./');

reflectInjector
  .initialize({
    email: 'elgubenis@gmail.com',
    password: 'hackdays2019',
    instanceId: 'my-other-service'
  })
  .then(() => {
    console.log('reflect injected!');
  })
  .catch(err => {
    console.error(err);
  });
