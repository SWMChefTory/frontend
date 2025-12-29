const withShareTarget = require("./withShareTarget");
const withShareActivity = require("./withShareActivity");

module.exports = function withAndroidPlugins(config) {
  config = withShareTarget(config);
  config = withShareActivity(config);
  return config;
};
