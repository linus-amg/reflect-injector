const express = require('express');
const app = express();

app.listen(4000, err => {
  if (!err) {
    console.log('listening');
  }
});

app.get('/test-route', (req, res) => {
  console.log('test-route got called');
  return res.send('worked!');
});

const reflectInjector = require('./');

reflectInjector
  .initialize({
    email: 'elgubenis@gmail.com',
    password: '****',
    instanceId: 'express-service'
  })
  .then(() => {
    console.log('reflect injected!');
  })
  .catch(err => {
    console.error(err);
  });
