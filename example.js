const reflectInjector = require('./');

reflectInjector
  .initialize({
    email: 'elgubenis@gmail.com',
    password: 'hackdays2019',
    instanceId: 'my-first-service'
  })
  .then(() => {
    console.log('reflect injected!');
  })
  .catch(err => {
    console.error(err);
  });

// function exitHandler(options, exitCode) {
//   if (options.cleanup) reflectInjector.destroy();
//   if (exitCode || exitCode === 0) console.log(exitCode);
//   if (options.exit) process.exit();
// }

// process.on('exit', exitHandler.bind(null, { cleanup: true }));

// //catches ctrl+c event
// process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// // catches "kill pid" (for example: nodemon restart)
// process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
// process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

// //catches uncaught exceptions
// process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
