const firebase = require('firebase');

const firebaseConfig = {
  apiKey: 'AIzaSyDl4H-O-bQHH_wg1NlLxQSLdkonbyt80nU',
  authDomain: 'reflect-gg.firebaseapp.com',
  databaseURL: 'https://reflect-gg.firebaseio.com',
  projectId: 'reflect-gg',
  storageBucket: '',
  messagingSenderId: '539429453915',
  appId: '1:539429453915:web:4b019ca2e77d8d2c'
};

module.exports = () => {
  firebase.initializeApp(firebaseConfig);

  return firebase;
};
