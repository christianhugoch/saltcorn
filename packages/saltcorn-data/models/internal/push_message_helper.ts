import db from "../../db";
import webpush from "web-push";
import admin from "firebase-admin";
import { ApnsClient, SilentNotification } from "apns2";
import utils from "../../utils";
import type Notification from "../notification";
import { readFile } from "fs/promises";

const { getSafeBaseUrl } = utils;

// Web
export type WebPushSubscription = {
  type: "web-push";
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

// Mobile
export type MobileSubscription = {
  type: "fcm-push" | "apns-push";
  token: string;
  deviceId: string;
};

// export type Subscription = WebPushSubscription & MobileSubscription;

type PushMessageHelperConfig = {
  vapidPublicKey?: string;
  vapidPrivateKey?: string;
  vapidEmail?: string;
  pushNotificationIcon?: string;
  pushNotificationBadge?: string;

  firebase: {
    jsonPath?: string;
    jsonContent?: any;
  };

  apns?: {
    teamId: string;
    signingKey: string;
    signingKeyId: string;
    appId: string;
  };

  notificationSubs?: Record<string, Array<any>>;
  syncSubs?: Record<string, Array<MobileSubscription>>;
};

/**
 * PushMessageHelper Class
 * @category saltcorn-data
 * @module models/internal/push_message_helper
 * @subcategory models
 */
export class PushMessageHelper {
  vapidPublicKey?: string;
  vapidPrivateKey?: string;
  vapidEmail?: string;
  icon?: string;
  badge?: string;

  firebaseJsonPath?: string;
  firebaseJsonContent?: any;
  firebaseApp?: admin.app.App | null;

  apnsSigningKey?: string;
  apnsSigningKeyId?: string;

  apns?: {
    teamId: string;
    signingKey: string;
    signingKeyId: string;
    appId: string;
  };
  apnsClient?: ApnsClient;

  notificationSubs: Record<string, Array<any>>;
  syncSubs: Record<string, Array<MobileSubscription>>;

  state: any;

  /**
   * normal first init
   * @param config - PushMessageHelper configuration
   */
  constructor(config: PushMessageHelperConfig) {
    this.vapidPublicKey = config.vapidPublicKey;
    this.vapidPrivateKey = config.vapidPrivateKey;
    this.vapidEmail = config.vapidEmail;
    this.icon = config.pushNotificationIcon;
    this.badge = config.pushNotificationBadge;
    this.notificationSubs = config.notificationSubs || {};
    this.syncSubs = config.syncSubs || {};
    this.firebaseJsonPath = config.firebase.jsonPath;
    this.firebaseJsonContent = config.firebase.jsonContent;

    this.apns = config.apns;
    // this.fcms = config.fcms;

    this.state = require("../../db/state").getState();
    if (this.firebaseJsonContent) this.initFCMApp();
    if (this.apns) this.initApnsClient();
  }

  /**
   * will be used when a config changes (no complete re-init)
   * @param {PushMessageHelperConfig} config - new configuration.
   */
  public updateConfig(config: any) {
    this.vapidPublicKey = config.vapidPublicKey;
    this.vapidPrivateKey = config.vapidPrivateKey;
    this.vapidEmail = config.vapidEmail;
    this.icon = config.pushNotificationIcon;
    this.badge = config.pushNotificationBadge;
    this.notificationSubs = config.notificationSubs || {};
    this.syncSubs = config.syncSubs || {};
    if (config.firebase.jsonPath !== this.firebaseJsonPath) {
      this.firebaseJsonPath = config.firebase.jsonPath;
      this.firebaseJsonContent = config.firebase.jsonContent;
      if (this.firebaseJsonContent) this.initFCMApp();
    }
  }

  /**
   * Sends a notification to all subscriptions.
   * @param {Notification} notification - The notification to send.
   */
  public async pushNotification(notification: Notification) {
    const usedDeviceIds = new Set<string>();
    for (const subscription of this.notificationSubs[notification.user_id] ||
      []) {
      try {
        switch (subscription.type) {
          case "fcm-push": {
            if (usedDeviceIds.has(subscription.deviceId)) {
              this.state.log(
                5,
                `Skipping FCM notification to device ${subscription.deviceId} as already used`
              );
            } else {
              await this.fcmPush(notification, subscription);
              usedDeviceIds.add(subscription.deviceId);
            }
            break;
          }
          case "web-push":
          default: {
            await this.webPush(notification, subscription);
            break;
          }
        }
      } catch (error) {
        this.state.log(5, `Error sending push notification: ${error}`);
      }
    }
  }

  public async pushSync(tableName: string) {
    if (!this.firebaseApp) {
      this.state.log(5, "Firebase app not initialized");
    } else {
      for (const userSubs of Object.values(this.syncSubs)) {
        const pushedDeviceIds = new Set<string>();
        for (const userSub of userSubs) {
          if (pushedDeviceIds.has(userSub.deviceId)) {
            console.log(
              `Skipping push sync to device ${userSub.deviceId} as already pushed`
            );
            continue;
          }
          try {
            const { token, type, deviceId } = userSub;
            switch (type) {
              case "apns-push":
                const sn = new SilentNotification(token);
                try {
                  if (!this.apnsClient)
                    throw new Error("APNS client not initialized");
                  await this.apnsClient.send(sn);
                } catch (err: any) {
                  console.error(err);
                }
                break;
              case "fcm-push":
                const messageId = await admin.messaging(this.firebaseApp).send({
                  token: token,
                  data: { type: "push_sync", table: tableName },
                });
                this.state.log(
                  5,
                  `Sync push sent successfully. FCM messageId: ${messageId}`
                );
                break;
              default:
                throw new Error(
                  `Unknown push subscription type: ${type}`
                );
            }
            pushedDeviceIds.add(deviceId);
          } catch (error) {
            this.state.log(5, `Error sending sync push: ${error}`);
          }
        }
      }
    }
  }

  private async webPush(notification: Notification, sub: WebPushSubscription) {
    this.state.log(5, `Sending web push notification to ${sub.endpoint}`);
    if (!(this.vapidPublicKey && this.vapidPrivateKey && this.vapidEmail))
      throw new Error("VAPID not configured");
    const payload: any = {
      title: notification.title,
      body: notification.body,
    };
    if (this.icon) payload.icon = `/files/serve/${this.icon}`;
    if (this.badge) payload.badge = `/files/serve/${this.badge}`;
    await webpush.sendNotification(sub, JSON.stringify(payload), {
      vapidDetails: {
        subject: `mailto:${this.vapidEmail}`,
        publicKey: this.vapidPublicKey,
        privateKey: this.vapidPrivateKey,
      },
    });
  }

  private async fcmPush(notification: Notification, sub: MobileSubscription) {
    this.state.log(5, "Sending FCM notification");
    if (!this.firebaseJsonPath) throw new Error("Firebase config file not set");
    else if (!this.firebaseApp) {
      throw new Error("Firebase app not initialized");
    } else {
      const notificationData: any = {
        title: notification.title,
        body: notification.body,
      };
      if (this.icon) {
        const baseUrl = getSafeBaseUrl();
        if (baseUrl)
          notificationData.imageUrl = `${baseUrl}/files/serve/${this.icon}`;
      }
      const data = {
        type: "push_notification",
      };
      const messageId = await admin.messaging(this.firebaseApp).send({
        token: sub.token,
        notification: notificationData,
        data: data,
      });
      this.state.log(5, `FCM notification sent successfully: ${messageId}`);
    }
  }

  private async initFCMApp() {
    const appName = `${db.getTenantSchema()}_fcm_app`;
    try {
      const existingApp = admin.app(appName);
      await existingApp.delete();
      this.state.log(5, `Deleted existing Firebase app: ${appName}`);
    } catch (err) {
      // app does not exist – safe to ignore
    }
    const app = admin.initializeApp(
      {
        credential: admin.credential.cert(this.firebaseJsonContent),
      },
      appName
    );
    this.firebaseApp = app;
    this.state.log(5, `Initialized Firebase app: ${appName}`);
  }

  private async initApnsClient() {
    if (!this.apns) throw new Error("APNS config not set");
    const keyContent = await readFile(this.apns.signingKey, "utf8");
    this.apnsClient = new ApnsClient({
      team: this.apns.teamId,
      keyId: this.apns.signingKeyId,
      signingKey: keyContent,
      defaultTopic: this.apns.appId,
      requestTimeout: 0, // optional, Default: 0 (without timeout)
      keepAlive: true, // optional, Default: 5000
    });
  }
}
