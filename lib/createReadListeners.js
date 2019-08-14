const firebase = require('firebase');
const usage = require('usage');

const metadata = require('./metadata');

const WRITE_STATISTICS_INTERVAL_MS = 1000 * 1; // every 10 seconds
const MAX_COUNT = 60; // 6 = 1 minute retention, 6 * 60 = 1 hour retention

const createReadListeners = (uid, instanceId) => {
  const stats = firebase.database().ref(`/users/${uid}/${instanceId}/stats`);

  // whenever we get new stats, remove an old entry
  stats.on('value', function(snapshot) {
    if (snapshot.numChildren() > MAX_COUNT) {
      var childCount = 0;
      var updates = {};
      snapshot.forEach(function(child) {
        if (++childCount < snapshot.numChildren() - MAX_COUNT + 1) {
          updates[child.key] = null;
        }
      });
      stats.update(updates);
    }
  });

  const writeStatistics = () => {
    usage.lookup(process.pid, function(err, result) {
      stats.push({
        memory: {
          memory: result.memory,
          memoryInfo: result.memoryInfo
        },
        cpu: result.cpu,
        metadata,
        timestamp: new Date().getTime()
      });
    });
  };

  writeStatistics();
  const writeStatisticsInterval = setInterval(
    writeStatistics,
    WRITE_STATISTICS_INTERVAL_MS
  );

  const cleanUpFunction = () => {
    stats.off();
    clearInterval(writeStatisticsInterval);
  };

  return cleanUpFunction;
};

module.exports = createReadListeners;
