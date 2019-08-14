const firebase = require('firebase');
const memwatch = require('node-memwatch');

const v8Profiler = require('v8-profiler-next');

const metadata = require('./metadata');

let currentHeapDiff;

const handleIntent = (intent, payload, ref) => {
  console.log(intent);
  const responses = firebase.database().ref(`${ref}/responses`);

  if (intent === 'START_HEAP') {
    metadata.runningHeapDiff = true;
    currentHeapDiff = new memwatch.HeapDiff();
  }

  if (intent === 'STOP_HEAP') {
    metadata.runningHeapDiff = false;
    const diff = currentHeapDiff.end();

    responses.push({
      intent: 'HEAP_DIFFED',
      payload: diff
    });
  }

  if (intent === 'START_CPU_PROFILE') {
    metadata.runningCpuProfile = true;
    v8Profiler.startProfiling('profile', true);
  }

  if (intent === 'STOP_CPU_PROFILE') {
    metadata.runningCpuProfile = false;
    const profiler = v8Profiler.stopProfiling('profile');

    delete profiler.timestamps;

    const child = responses.push({
      intent: 'CPU_PROFILE',
      payload: JSON.stringify(profiler)
    });

    metadata.profileAvailable = child.key;

    profiler.delete();
  }

  if (intent === 'READ_CODE') {
    const [nodeExecutable, scriptFile] = process.argv;

    require('fs').readFile(scriptFile, 'utf-8', (err, code) => {
      if (!err) {
        responses.push({
          intent: 'CODE',
          payload: {
            code,
            scriptFile,
            nodeExecutable
          }
        });
      }
    });
  }

  if (intent === 'RESTART') {
    metadata.restarting = true;
    setTimeout(() => {
      process.kill(process.pid, 'SIGUSR2');
    }, 2500);
  }

  if (intent === 'TERMINATE') {
    metadata.terminating = true;
    setTimeout(() => {
      process.kill(process.pid);
    }, 2500);
  }
};

const createWriteListeners = (uid, instanceId) => {
  const ref = `/users/${uid}/${instanceId}`;

  const requests = firebase.database().ref(`${ref}/requests`);

  requests.on('value', async snapshot => {
    const value = snapshot.val();

    if (value) {
      const [key] = Object.keys(value);
      await requests.child(key).remove();

      const { intent, payload = {} } = value[key];

      handleIntent(intent, payload, ref);
    }
  });

  const cleanUpFunction = () => {
    requests.off();
  };

  return cleanUpFunction;
};

module.exports = createWriteListeners;
