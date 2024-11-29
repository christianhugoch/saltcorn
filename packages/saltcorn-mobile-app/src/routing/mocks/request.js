/*global saltcorn, */

import i18next from "i18next";

export function MobileRequest({
  xhr = false,
  files = undefined,
  query = undefined,
  body = undefined,
  refererRoute = undefined,
} = {}) {
  const cfg = saltcorn.data.state.getState().mobileConfig;
  const flashMessages = [];
  const refererPath = refererRoute ? refererRoute.route : undefined;
  const referQuery =
    refererPath && refererRoute.query
      ? refererRoute.query.startsWith("?")
        ? refererRoute.query
        : `?${refererRoute.query}`
      : "";
  const referer = refererPath ? `${refererPath}${referQuery}` : undefined;
  const values = {};
  if (refererRoute) values.Referrer = referer;
  return {
    __: (s, ...params) =>
      i18next.t(s, {
        postProcess: "sprintf",
        sprintf: params,
      }),
    isAuthenticated: () => {
      const mobileCfg = saltcorn.data.state.getState().mobileConfig;
      return mobileCfg && mobileCfg.jwt && !mobileCfg.isPublicUser;
    },
    getLocale: () => {
      const mobileCfg = saltcorn.data.state.getState().mobileConfig;
      return mobileCfg?.user?.language ? mobileCfg.user.language : "en";
    },
    user: cfg.user,
    flash: (type, msg) => {
      flashMessages.push({ type, msg });
    },
    flashMessages: () => {
      return flashMessages;
    },
    get: (key) => {
      return values[key] ? values[key] : "";
    },
    set: (key, val) => {
      values[key] = val;
    },
    csrfToken: () => "",
    xhr,
    files,
    query,
    body,
    headers: {
      referer: referer,
    },
  };
}
