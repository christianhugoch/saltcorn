import { spawnSync, execSync } from "child_process";
import { join, basename } from "path";
import { existsSync, mkdirSync } from "fs";
import { copySync } from "fs-extra";
import type User from "@saltcorn/data/models/user";
import utils = require("@saltcorn/data/utils");
const { safeEnding } = utils;
import File from "@saltcorn/data/models/file";
import {
  writePodfile,
  modifyGradleConfig,
  modifyAndroidManifest,
  writeDataExtractionRules,
  writeNetworkSecurityConfig,
  copyPrepopulatedDb,
  modifyInfoPlist,
  writePrivacyInfo,
  modifyXcodeProjectFile,
} from "./common-build-utils";

export type CapacitorCfg = {
  buildDir: string;
  platforms: string[];
  buildType: "debug" | "release";
  appName: string;
  appVersion: string;

  useDocker?: boolean;
  keyStorePath: string;
  keyStoreAlias: string;
  keyStorePassword: string;
  isUnsecureKeyStore: boolean;

  appleTeamId?: string;
  provisioningGUUID?: string;
};

export class CapacitorHelper {
  buildDir: string;
  platforms: string[];
  buildType: "debug" | "release";
  appName: string;
  appVersion: string;

  useDocker?: boolean;
  keyStoreFile: string;
  keyStoreAlias: string;
  keyStorePassword: string;
  isUnsecureKeyStore: boolean;

  appleTeamId?: string;
  provisioningGUUID?: string;

  isAndroid: boolean;
  isIOS: boolean;

  constructor(cfg: CapacitorCfg) {
    this.buildDir = cfg.buildDir;
    this.platforms = cfg.platforms;
    this.buildType = cfg.buildType || "debug";
    this.appName = cfg.appName;
    this.appVersion = cfg.appVersion;
    this.useDocker = cfg.useDocker;
    this.keyStoreFile = basename(cfg.keyStorePath);
    this.keyStoreAlias = cfg.keyStoreAlias;
    this.keyStorePassword = cfg.keyStorePassword;
    this.isUnsecureKeyStore = cfg.isUnsecureKeyStore;
    this.appleTeamId = cfg.appleTeamId;
    this.provisioningGUUID = cfg.provisioningGUUID;
    this.isAndroid = this.platforms.includes("android");
    this.isIOS = this.platforms.includes("ios");
  }

  public async buildApp() {
    if (!this.useDocker) {
      this.addPlatforms();
      this.generateAssets();
      this.capSync();
      copyPrepopulatedDb(this.buildDir, this.platforms);
      if (this.isAndroid) {
        await modifyAndroidManifest(this.buildDir);
        writeDataExtractionRules(this.buildDir);
        writeNetworkSecurityConfig(this.buildDir);
        modifyGradleConfig(this.buildDir, this.appVersion);
        this.capBuild();
      }
    } else this.buildWithDocker();
    if (this.isIOS) {
      modifyXcodeProjectFile(this.buildDir, this.appVersion);
      writePodfile(this.buildDir);
      await modifyInfoPlist(this.buildDir);
      writePrivacyInfo(this.buildDir);
      this.xCodeBuild();
    }
  }

  public tryCopyAppFiles(copyDir: string, user: User, appName?: string) {
    const copyHelper = async (
      ending: "apk" | "aab" | "ipa",
      outDir: string
    ) => {
      const fileName = join(
        outDir,
        this.isUnsecureKeyStore
          ? `app-release${ending === "apk" ? "-unsigned" : ""}.${ending}`
          : `app-release-signed.${ending}`
      );
      if (existsSync(fileName)) {
        const dstFile = appName
          ? safeEnding(appName, `.${ending}`)
          : `app-${this.buildType}.${ending}`;
        copySync(fileName, join(copyDir, dstFile));
        await File.set_xattr_of_existing_file(dstFile, copyDir, user);
      }
    };
    if (!existsSync(copyDir)) mkdirSync(copyDir);
    // android
    copyHelper(
      this.buildType === "debug" ? "apk" : "aab",
      join(
        this.buildDir,
        "android",
        "app",
        "build",
        "outputs",
        this.buildType === "debug" ? "apk" : "bundle",
        "release"
      )
    );
    // ipa
    copyHelper("ipa", this.buildDir);
  }

  private addPlatforms() {
    const addFn = (platform: string) => {
      let result = spawnSync("npm", ["install", `@capacitor/${platform}`], {
        cwd: this.buildDir,
        maxBuffer: 1024 * 1024 * 10,
        env: {
          ...process.env,
          NODE_ENV: "development",
        },
      });
      if (result.output) console.log(result.output.toString());
      else if (result.error)
        throw new Error(
          `Unable to install ${platform} (code ${result.status})` +
            `\n\n${result.error.toString()}`
        );
      result = spawnSync("npx", ["cap", "add", platform], {
        cwd: this.buildDir,
        maxBuffer: 1024 * 1024 * 10,
        env: {
          ...process.env,
          NODE_ENV: "development",
        },
      });
      if (result.output) console.log(result.output.toString());
      else if (result.error)
        throw new Error(
          `Unable to add ${platform} (code ${result.status})` +
            `\n\n${result.error.toString()}`
        );
    };
    for (const platform of this.platforms) addFn(platform);
  }

  private generateAssets() {
    const result = spawnSync("npx", ["capacitor-assets", "generate"], {
      cwd: this.buildDir,
      maxBuffer: 1024 * 1024 * 10,
      env: {
        ...process.env,
      },
    });
    if (result.output) console.log(result.output.toString());
    else if (result.error)
      throw new Error(
        `Unable to generate assets (code ${result.status})` +
          `\n\n${result.error.toString()}`
      );
  }

  private capBuild() {
    console.log("npx cap build");
    const result = spawnSync(
      "npx",
      [
        "cap",
        "build",
        "android",
        "--androidreleasetype",
        this.buildType === "release" ? "AAB" : "APK",
        "--keystorepath",
        join(this.buildDir, this.keyStoreFile),
        "--keystorepass",
        this.keyStorePassword,
        "--keystorealias",
        this.keyStoreAlias,
        "--keystorealiaspass",
        this.keyStorePassword,
      ],
      {
        cwd: this.buildDir,
        maxBuffer: 1024 * 1024 * 10,
        env: {
          ...process.env,
          NODE_ENV: "development",
        },
      }
    );
    if (result.output) console.log(result.output.toString());
    else if (result.error)
      throw new Error(
        `Unable to call the build (code ${result.status})` +
          `\n\n${result.error.toString()}`
      );
  }

  private buildWithDocker() {
    console.log("building with docker");
    const spawnParams = [
      "run",
      "--network",
      "host",
      "-v",
      `${this.buildDir}:/saltcorn-mobile-app`,
      "saltcorn/capacitor-builder",
    ];
    spawnParams.push(this.buildType);
    spawnParams.push(this.appVersion);
    if (this.buildType === "release")
      spawnParams.push(
        this.keyStoreFile,
        this.keyStoreAlias,
        this.keyStorePassword
      );
    const result = spawnSync("docker", spawnParams, {
      cwd: ".",
      maxBuffer: 1024 * 1024 * 10,
    });
    if (result.output) console.log(result.output.toString());
    else if (result.error)
      throw new Error(
        `Unable to build with docker (code ${result.status})` +
          `\n\n${result.error.toString()}`
      );
  }

  private xCodeBuild() {
    try {
      console.log("xcodebuild -workspace");
      let buffer = execSync(
        `xcodebuild -workspace ios/App/App.xcworkspace ` +
          `-scheme App -destination "generic/platform=iOS" ` +
          `-archivePath MyArchive.xcarchive archive PROVISIONING_PROFILE="${this.provisioningGUUID}" ` +
          ' CODE_SIGN_STYLE="Manual" CODE_SIGN_IDENTITY="iPhone Distribution" ' +
          ` DEVELOPMENT_TEAM="${this.appleTeamId}" `,
        { cwd: this.buildDir, maxBuffer: 1024 * 1024 * 10 }
      );

      if (!existsSync(join(this.buildDir, "MyArchive.xcarchive"))) {
        console.log(
          "Unable to export ipa: xcodebuild did not create the archivePath."
        );
        return 1;
      } else {
        console.log("xcodebuild -exportArchive");
        buffer = execSync(
          "xcodebuild -exportArchive -archivePath MyArchive.xcarchive " +
            `-exportPath ${this.buildDir} -exportOptionsPlist ExportOptions.plist`,
          { cwd: this.buildDir, maxBuffer: 1024 * 1024 * 10 }
        );
        console.log(buffer.toString());
        // to upload it automatically:
        // xrun altool --upload-app -f [.ipa file] -t ios -u [apple-id] -p [app-specific password]
        return 0;
      }
    } catch (err) {
      console.log(err);
      return 1;
    }
  }

  private capSync() {
    const result = spawnSync("npx", ["cap", "sync"], {
      cwd: this.buildDir,
      maxBuffer: 1024 * 1024 * 10,
      env: {
        ...process.env,
        NODE_ENV: "development",
      },
    });
    if (result.output) console.log(result.output.toString());
    else if (result.error)
      throw new Error(
        `Unable to sync the native directory (code ${result.status})` +
          `\n\n${result.error.toString()}`
      );
  }
}
