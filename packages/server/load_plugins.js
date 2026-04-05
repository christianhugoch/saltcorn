/**
 * @deprecated Import directly from @saltcorn/data/models/plugin (Plugin static methods)
 */
const Plugin = require("@saltcorn/data/models/plugin");

module.exports = {
  loadAndSaveNewPlugin: Plugin.loadAndSaveNewPlugin,
  loadAllPlugins: Plugin.loadAllPlugins,
  loadPlugin: Plugin.loadPlugin,
  requirePlugin: Plugin.requirePlugin,
  getEngineInfos: Plugin.getEngineInfos,
  ensurePluginSupport: Plugin.ensurePluginSupport,
};
