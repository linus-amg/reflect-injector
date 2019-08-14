const reflectInjector = require('./');

reflectInjector
  .initialize({
    email: 'elgubenis@gmail.com',
    password: '****',
    instanceId: 'my-other-service'
  })
  .then(() => {
    console.log('reflect injected!');
  })
  .catch(err => {
    console.error(err);
  });
