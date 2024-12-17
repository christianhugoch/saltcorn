const { PluginManager } = require("live-plugin-manager");
const { loadAllPlugins } = require("@saltcorn/server/load_plugins");
import { join, basename } from "path";
import { copySync } from "fs-extra";
import Plugin from "@saltcorn/data/models/plugin";
import {
  buildTablesFile,
  copySbadmin2Deps,
  copySiteLogo,
  copyServerFiles,
  copyTranslationFiles,
  createSqliteDb,
  writeCfgFile,
  prepareSplashPage,
  prepareBuildDir,
  prepareExportOptionsPlist,
  writeCapacitorConfig,
  decodeProvisioningProfile,
  prepAppIcon,
} from "./utils/common-build-utils";
import {
  bundlePackagesAndPlugins,
  copyPublicDirs,
  bundleMobileAppCode,
} from "./utils/package-bundle-utils";
import User from "@saltcorn/data/models/user";
import { CapacitorHelper } from "./utils/capacitor-helper";
import { removeNonWordChars } from "@saltcorn/data/utils";

type EntryPointType = "view" | "page";
const appIdDefault = "saltcorn.mobile.app";
const appNameDefault = "SaltcornMobileApp";

type MobileBuilderConfig = {
  appName?: string;
  appId?: string;
  appVersion?: string;
  appIcon?: string;
  templateDir: string;
  buildDir: string;
  cliDir: string;
  useDocker?: boolean;
  platforms: string[];
  localUserTables?: string[];
  synchedTables?: string[];
  includedPlugins?: string[];
  entryPoint: string;
  entryPointType: EntryPointType;
  serverURL: string;
  splashPage?: string;
  autoPublicLogin: string;
  allowOfflineMode: string;
  plugins: Plugin[];
  copyTargetDir?: string;
  user?: User;
  appleTeamId?: string;
  provisioningProfile?: string;
  tenantAppName?: string;
  keyStorePath?: string;
  keyStoreAlias?: string;
  keyStorePassword?: string;
  buildType: "debug" | "release";
};

/**
 *
 */
export class MobileBuilder {
  appName: string;
  appId: string;
  appVersion: string;
  appIcon?: string;
  templateDir: string;
  buildDir: string;
  cliDir: string;
  useDocker?: boolean;
  platforms: string[];
  localUserTables: string[];
  synchedTables: string[];
  includedPlugins: string[];
  entryPoint: string;
  entryPointType: EntryPointType;
  serverURL: string;
  splashPage?: string;
  autoPublicLogin: string;
  allowOfflineMode: string;
  pluginManager: any;
  plugins: Plugin[];
  packageRoot = join(__dirname, "../");
  copyTargetDir?: string;
  user?: User;
  appleTeamId?: string;
  provisioningProfile?: string;
  tenantAppName?: string;
  keyStorePath: string;
  keyStoreAlias: string;
  keyStorePassword: string;
  isUnsecureKeyStore: boolean;
  buildType: "debug" | "release";

  /**
   *
   * @param cfg
   */
  constructor(cfg: MobileBuilderConfig) {
    this.appName = cfg.appName || appNameDefault;
    if (cfg.appId) this.appId = cfg.appId;
    else if (cfg.appName && cfg.appName !== appNameDefault)
      this.appId = `${removeNonWordChars(cfg.appName)}.mobile.app`;
    else this.appId = appIdDefault;
    this.appVersion = cfg.appVersion || "0.0.1";
    this.appIcon = cfg.appIcon;
    this.templateDir = cfg.templateDir;
    this.buildDir = cfg.buildDir;
    this.cliDir = cfg.cliDir;
    this.useDocker = cfg.useDocker;
    this.platforms = cfg.platforms;
    this.localUserTables = cfg.localUserTables ? cfg.localUserTables : [];
    this.synchedTables = cfg.synchedTables ? cfg.synchedTables : [];
    this.includedPlugins = cfg.includedPlugins ? cfg.includedPlugins : [];
    this.entryPoint = cfg.entryPoint;
    this.entryPointType = cfg.entryPointType;
    this.serverURL = cfg.serverURL;
    this.splashPage = cfg.splashPage;
    this.autoPublicLogin = cfg.autoPublicLogin;
    this.allowOfflineMode = cfg.allowOfflineMode;
    this.pluginManager = new PluginManager({
      pluginsPath: join(this.buildDir, "plugin_packages", "node_modules"),
    });
    this.plugins = cfg.plugins;
    this.copyTargetDir = cfg.copyTargetDir;
    this.user = cfg.user;
    this.provisioningProfile = cfg.provisioningProfile;
    this.tenantAppName = cfg.tenantAppName;
    if (cfg.keyStorePath && cfg.keyStoreAlias && cfg.keyStorePassword) {
      this.keyStorePath = cfg.keyStorePath;
      this.keyStoreAlias = cfg.keyStoreAlias;
      this.keyStorePassword = cfg.keyStorePassword;
      this.isUnsecureKeyStore = false;
    } else {
      this.keyStorePath = join(this.buildDir, "unsecure-default-key.jks");
      this.keyStoreAlias = "unsecure-default-alias";
      this.keyStorePassword = "unsecurepassw";
      this.isUnsecureKeyStore = true;
    }
    this.buildType = cfg.buildType;
  }

  /**
   *
   */
  async build() {
    try {
      prepareBuildDir(this.buildDir, this.templateDir);
      writeCapacitorConfig(this.buildDir, {
        appName: this.appName,
        appId: this.appId !== appIdDefault ? this.appId : undefined,
        appVersion: this.appVersion,
        unsecureNetwork:
          this.serverURL.startsWith("http://") || !this.serverURL,
        keystorePath: this.keyStorePath,
        keystoreAlias: this.keyStoreAlias,
        keystorePassword: this.keyStorePassword,
        keystoreAliasPassword: this.keyStorePassword,
        buildType: this.buildType,
      });
      if (this.appIcon) prepAppIcon(this.buildDir, this.appIcon);

      let iosParams = null;
      if (this.platforms.includes("ios")) {
        iosParams = await decodeProvisioningProfile(
          this.buildDir,
          this.provisioningProfile!
        );
        prepareExportOptionsPlist(this.buildDir, this.appId, iosParams.guuid);
      }
      copyServerFiles(this.buildDir);
      copySbadmin2Deps(this.buildDir);
      await copySiteLogo(this.buildDir);
      copyTranslationFiles(this.buildDir);
      writeCfgFile({
        buildDir: this.buildDir,
        entryPoint: this.entryPoint,
        entryPointType: this.entryPointType,
        serverPath: this.serverURL ? this.serverURL : "http://10.0.2.2:3000", // host localhost of the android emulator
        localUserTables: this.localUserTables,
        synchedTables: this.synchedTables,
        tenantAppName: this.tenantAppName,
        autoPublicLogin: this.autoPublicLogin,
        allowOfflineMode: this.allowOfflineMode,
      });
      let resultCode = await bundlePackagesAndPlugins(
        this.buildDir,
        this.plugins
      );
      if (resultCode !== 0) return resultCode;
      resultCode = bundleMobileAppCode(this.buildDir);
      if (resultCode !== 0) return resultCode;
      await loadAllPlugins();
      await copyPublicDirs(this.buildDir);
      await buildTablesFile(this.buildDir, this.includedPlugins);
      if (this.splashPage)
        await prepareSplashPage(
          this.buildDir,
          this.splashPage,
          this.serverURL,
          this.tenantAppName,
          this.user
        );
      resultCode = await createSqliteDb(this.buildDir);
      if (resultCode !== 0) return resultCode;
      if (!this.isUnsecureKeyStore)
        copySync(
          this.keyStorePath,
          join(this.buildDir, basename(this.keyStorePath))
        );
      const capacitorHelper = new CapacitorHelper({
        ...this,
        appVersion: this.appVersion,
        appleTeamId: iosParams?.teamId,
        provisioningGUUID: iosParams?.guuid,
      });
      await capacitorHelper.buildApp();
      if (resultCode === 0 && this.copyTargetDir) {
        capacitorHelper.tryCopyAppFiles(
          this.copyTargetDir,
          this.user!,
          this.appName
        );
      }
      return 0;
    } catch (e: any) {
      console.error(e);
      return 1;
    }
  }
}
