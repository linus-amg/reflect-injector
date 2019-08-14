const firebaseConnect = require('./lib/firebaseConnector');
const firebase = require('firebase');

const createReadListeners = require('./lib/createReadListeners');
const createWriteListeners = require('./lib/createWriteListeners');

const defaultOptions = {
  readOnly: false
};

const reflectInjector = {};

const listeners = {};

reflectInjector.initialize = clientOptions =>
  new Promise(async (resolve, reject) => {
    const options = Object.assign(defaultOptions, clientOptions);

    const { email, password, instanceId } = options;

    if (email && password && instanceId) {
      const firebase = firebaseConnect();

      const firebaseAuthResponse = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(reject);

      if (firebaseAuthResponse) {
        const { user } = firebaseAuthResponse;
        const { uid } = user;

        // do stuff regarding readOnly data, creating statistics etc.
        listeners.destroyReadListeners = createReadListeners(uid, instanceId);

        // this injector is not read-only, it can also accept writes
        if (!options.readOnly) {
          // do stuff recarding writing data, create listeners for profiling etc.
          listeners.destroyWriteListeners = createWriteListeners(
            uid,
            instanceId
          );
        }

        resolve();
      } else {
        reject(new Error('Unexpected Error'));
      }
    } else {
      console.error(
        new Error(
          `Cannot initialize the reflectInjector, email, password or instanceId are missing`
        )
      );
    }
  });

reflectInjector.destroy = () => {
  firebase.auth().signOut();

  if (listeners.destroyWriteListeners) {
    listeners.destroyWriteListeners();
  }

  if (listeners.destroyReadListeners) {
    listeners.destroyReadListeners();
  }
};

module.exports = reflectInjector;
