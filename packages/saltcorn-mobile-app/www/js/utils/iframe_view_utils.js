/*eslint-env browser*/
/*global $, submitWithEmptyAction, is_paging_param, bootstrap, common_done, unique_field_from_rows, inline_submit_success*/

function combineFormAndQuery(form, query) {
  let paramsList = [];
  const formData = new FormData(form[0]);
  for (const [k, v] of formData.entries()) {
    paramsList.push(`${k}=${v}`);
  }
  let sp = new URLSearchParams(query);
  for (let [k, v] of sp.entries()) {
    if (k === "redirect") v = `get${v}`;
    paramsList.push(`${k}=${v}`);
  }
  return paramsList.length > 0 ? `?${paramsList.join("&")}` : undefined;
}

/**
 * Pass View or Page source into the app internal router,
 * links with an URL source are opened in the system browser.
 * @param {string} url
 * @param {string} linkSrc - URL, View or Page
 */
async function execLink(url, linkSrc) {
  if (linkSrc === "URL") {
    parent.cordova.InAppBrowser.open(url, "_system");
  } else
    try {
      showLoadSpinner();
      const { path, query } = parent.splitPathQuery(url);
      await parent.handleRoute(`get${path}`, query);
    } finally {
      removeLoadSpinner();
    }
}

async function execNavbarLink(url) {
  $(".navbar-toggler").click();
  execLink(url);
}

/**
 *
 * @param {*} e
 * @param {*} urlSuffix
 * @returns
 */
async function formSubmit(e, urlSuffix, viewname, noSubmitCb, matchingState) {
  try {
    showLoadSpinner();
    if (!noSubmitCb) e.submit();
    const files = {};
    const urlParams = new URLSearchParams();
    const data = matchingState ? {} : null;
    for (const entry of new FormData(e).entries()) {
      if (entry[1] instanceof File) files[entry[0]] = entry[1];
      else {
        // is there a hidden input with a filename?
        const domEl = $(e).find(
          `[name='${entry[0]}'][mobile-camera-input='true']`
        );
        if (domEl.length > 0) {
          const tokens = entry[1].split("/");
          const fileName = tokens[tokens.length - 1];
          const directory = tokens.splice(0, tokens.length - 1).join("/");
          // read and add file to submit
          const binary = await parent.readBinary(fileName, directory);
          files[entry[0]] = new File([binary], fileName);
        } else if (!matchingState) urlParams.append(entry[0], entry[1]);
        else data[entry[0]] = entry[1];
      }
    }
    const queryStr = !matchingState
      ? urlParams.toString()
      : parent.currentQuery() || "";
    await parent.handleRoute(
      `post${urlSuffix}${viewname}`,
      queryStr,
      files,
      data
    );
  } finally {
    removeLoadSpinner();
  }
}

async function inline_local_submit(e, opts1) {
  try {
    e.preventDefault();
    showLoadSpinner();
    const opts = JSON.parse(decodeURIComponent(opts1 || "") || "{}");
    const form = $(e.target).closest("form");
    const urlParams = new URLSearchParams();
    for (const entry of new FormData(form[0]).entries()) {
      urlParams.append(entry[0], entry[1]);
    }
    const url = form.attr("action");
    await parent.router.resolve({
      pathname: `post${url}`,
      query: urlParams.toString(),
    });
    inline_submit_success(e, form, opts);
  } catch (error) {
    parent.showAlerts([
      {
        type: "error",
        msg: error.message ? error.message : "An error occured.",
      },
    ]);
  } finally {
    removeLoadSpinner();
  }
}

async function saveAndContinue(e, action, k) {
  try {
    showLoadSpinner();
    const form = $(e).closest("form");
    submitWithEmptyAction(form[0]);
    const queryStr = new URLSearchParams(new FormData(form[0])).toString();
    const res = await parent.router.resolve({
      pathname: `post${action}`,
      query: queryStr,
      xhr: true,
    });
    if (res.id && form.find("input[name=id")) {
      form.append(
        `<input type="hidden" class="form-control  " name="id" value="${res.id}">`
      );
    }
    if (k) await k();
    // TODO ch error (request.responseText?)
  } finally {
    removeLoadSpinner();
  }
}

async function loginRequest({ email, password, isSignup, isPublic }) {
  const opts = isPublic
    ? {
        method: "GET",
        path: "/auth/login-with/jwt",
      }
    : isSignup
    ? {
        method: "POST",
        path: "/auth/signup",
        body: {
          email,
          password,
        },
      }
    : {
        method: "GET",
        path: "/auth/login-with/jwt",
        params: {
          email,
          password,
        },
      };
  const response = await parent.apiCall(opts);
  return response.data;
}

async function login(e, entryPoint, isSignup) {
  try {
    showLoadSpinner();
    const formData = new FormData(e);
    const loginResult = await loginRequest({
      email: formData.get("email"),
      password: formData.get("password"),
      isSignup,
    });
    if (typeof loginResult === "string") {
      // use it as a token
      const decodedJwt = parent.jwt_decode(loginResult);
      const state = parent.saltcorn.data.state.getState();
      const config = state.mobileConfig;
      config.role_id = decodedJwt.user.role_id ? decodedJwt.user.role_id : 100;
      config.user_name = decodedJwt.user.email;
      config.user_id = decodedJwt.user.id;
      config.language = decodedJwt.user.language;
      config.isPublicUser = false;
      config.isOfflineMode = false;
      await parent.insertUser({
        id: config.user_id,
        email: config.user_name,
        role_id: config.role_id,
        language: config.language,
      });
      await parent.setJwt(loginResult);
      config.jwt = loginResult;
      await parent.i18next.changeLanguage(config.language);
      const alerts = [];
      if (config.allowOfflineMode) {
        const { offlineUser, hasOfflineData } =
          (await parent.offlineHelper.getLastOfflineSession()) || {};
        if (!offlineUser || offlineUser === config.user_name) {
          await parent.offlineHelper.sync();
        } else {
          if (hasOfflineData)
            alerts.push({
              type: "warning",
              msg: `'${offlineUser}' has not yet uploaded offline data.`,
            });
          else {
            await deleteOfflineData(true);
            await parent.offlineHelper.sync();
          }
        }
      }
      alerts.push({
        type: "success",
        msg: parent.i18next.t("Welcome, %s!", {
          postProcess: "sprintf",
          sprintf: [config.user_name],
        }),
      });
      parent.addRoute({ route: entryPoint, query: undefined });
      const page = await parent.router.resolve({
        pathname: entryPoint,
        fullWrap: true,
        alerts,
      });
      await parent.replaceIframe(page.content, page.isFile);
    } else if (loginResult?.alerts) {
      parent.showAlerts(loginResult?.alerts);
    } else {
      throw new Error("The login failed.");
    }
  } finally {
    removeLoadSpinner();
  }
}

async function publicLogin(entryPoint) {
  try {
    showLoadSpinner();
    const loginResult = await loginRequest({ isPublic: true });
    if (typeof loginResult === "string") {
      const config = parent.saltcorn.data.state.getState().mobileConfig;
      config.role_id = 100;
      config.user_name = "public";
      config.language = "en";
      config.isPublicUser = true;
      await parent.setJwt(loginResult);
      config.jwt = loginResult;
      parent.i18next.changeLanguage(config.language);
      parent.addRoute({ route: entryPoint, query: undefined });
      const page = await parent.router.resolve({
        pathname: entryPoint,
        fullWrap: true,
        alerts: [
          {
            type: "success",
            msg: parent.i18next.t("Welcome to %s!", {
              postProcess: "sprintf",
              sprintf: [
                parent.saltcorn.data.state.getState().getConfig("site_name") ||
                  "Saltcorn",
              ],
            }),
          },
        ],
      });
      await parent.replaceIframe(page.content, page.isFile);
    } else if (loginResult?.alerts) {
      parent.showAlerts(loginResult?.alerts);
    } else {
      throw new Error("The login failed.");
    }
  } catch (error) {
    console.log(error);
    parent.showAlerts([
      {
        type: "error",
        msg: error.message ? error.message : "An error occured.",
      },
    ]);
    throw error;
  } finally {
    removeLoadSpinner();
  }
}

async function logout() {
  const config = parent.saltcorn.data.state.getState().mobileConfig;
  try {
    showLoadSpinner();
    const page = await parent.router.resolve({
      pathname: "get/auth/logout",
      entryView: config.entry_point,
      versionTag: config.version_tag,
    });
    await parent.replaceIframe(page.content);
  } catch (error) {
    parent.showAlerts([
      {
        type: "error",
        msg: error.message ? error.message : "An error occured.",
      },
    ]);
  } finally {
    removeLoadSpinner();
  }
}

async function signupFormSubmit(e, entryView) {
  try {
    await login(e, entryView, true);
  } catch (error) {
    parent.errorAlert(error);
  }
}

async function loginFormSubmit(e, entryView) {
  try {
    await login(e, entryView, false);
  } catch (error) {
    parent.errorAlert(error);
  }
}

async function local_post_btn(e) {
  try {
    showLoadSpinner();
    const form = $(e).closest("form");
    const url = form.attr("action");
    const method = form.attr("method");
    const { path, query } = parent.splitPathQuery(url);
    await parent.handleRoute(
      `${method}${path}`,
      combineFormAndQuery(form, query)
    );
  } finally {
    removeLoadSpinner();
  }
}

/**
 *
 * @param {*} e
 * @param {*} path
 */
async function stateFormSubmit(e, path) {
  try {
    showLoadSpinner();
    const formQuery = new URLSearchParams(new FormData(e)).toString();
    await parent.handleRoute(path, formQuery);
  } finally {
    removeLoadSpinner();
  }
}

function removeQueryStringParameter(queryStr, key) {
  let params = [];
  for (const [k, v] of new URLSearchParams(queryStr).entries()) {
    if (k !== key) {
      params.push(`${k}=${v}`);
    }
  }
  return params.join("&");
}

function updateQueryStringParameter(queryStr, key, value) {
  if (!queryStr) {
    return `${key}=${value}`;
  }
  let params = [];
  let updated = false;
  for (const [k, v] of new URLSearchParams(queryStr).entries()) {
    if (k === key) {
      params.push(`${key}=${value}`);
      updated = true;
    } else {
      params.push(`${k}=${v}`);
    }
  }
  if (!updated) {
    params.push(`${key}=${value}`);
  }
  return params.join("&");
}

function invalidate_pagings(currentQuery) {
  let newQuery = currentQuery;
  const queryObj = Object.fromEntries(new URLSearchParams(newQuery).entries());
  const toRemove = Object.keys(queryObj).filter((val) => is_paging_param(val));
  for (const k of toRemove) {
    newQuery = removeQueryStringParameter(newQuery, k);
  }
  return newQuery;
}

async function set_state_fields(kvs, href) {
  try {
    showLoadSpinner();
    let queryParams = [];
    let currentQuery = parent.currentQuery();
    if (Object.keys(kvs).some((k) => !is_paging_param(k))) {
      currentQuery = invalidate_pagings(currentQuery);
    }
    Object.entries(kvs).forEach((kv) => {
      if (kv[1].unset && kv[1].unset === true) {
        currentQuery = removeQueryStringParameter(currentQuery, kv[0]);
      } else {
        currentQuery = updateQueryStringParameter(currentQuery, kv[0], kv[1]);
      }
    });
    for (const [k, v] of new URLSearchParams(currentQuery).entries()) {
      queryParams.push(`${k}=${v}`);
    }
    await parent.handleRoute(href, queryParams.join("&"));
  } finally {
    removeLoadSpinner();
  }
}

async function set_state_field(key, value) {
  try {
    showLoadSpinner();
    const query = updateQueryStringParameter(parent.currentQuery(), key, value);
    await parent.handleRoute(parent.currentLocation(), query);
  } finally {
    removeLoadSpinner();
  }
}

async function unset_state_field(key) {
  try {
    showLoadSpinner();
    const href = parent.currentLocation();
    const query = removeQueryStringParameter(parent.currentLocation(), key);
    await parent.handleRoute(href, query);
  } finally {
    removeLoadSpinner();
  }
}

async function sortby(k, desc, viewIdentifier) {
  await set_state_fields(
    {
      [`_${viewIdentifier}_sortby`]: k,
      [`_${viewIdentifier}_sortdesc`]: desc ? "on" : { unset: true },
    },
    parent.currentLocation()
  );
}

async function gopage(n, pagesize, viewIdentifier, extra) {
  await set_state_fields(
    {
      ...extra,
      [`_${viewIdentifier}_page`]: n,
      [`_${viewIdentifier}_pagesize`]: pagesize,
    },
    parent.currentLocation()
  );
}

async function mobile_modal(url, opts = {}) {
  if ($("#scmodal").length === 0) {
    $("body").append(`<div id="scmodal" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">            
          </button>
        </div>
        <div class="modal-body">
          <p>Modal body text goes here.</p>
        </div>
      </div>
    </div>
  </div>`);
  } else if ($("#scmodal").hasClass("show")) {
    var myModalEl = document.getElementById("scmodal");
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.dispose();
  }
  if (opts.submitReload === false) $("#scmodal").addClass("no-submit-reload");
  else $("#scmodal").removeClass("no-submit-reload");
  try {
    const { path, query } = parent.splitPathQuery(url);
    const mobileConfig = parent.saltcorn.data.state.getState().mobileConfig;
    if (
      mobileConfig.networkState === "none" &&
      mobileConfig.allowOfflineMode &&
      !mobileConfig.isOfflineMode
    ) {
      await parent.offlineHelper.startOfflineMode();
      parent.clearHistory();
      await parent.gotoEntryView();
    } else {
      const page = await parent.router.resolve({
        pathname: `get${path}`,
        query: query,
        alerts: [],
      });
      const modalContent = page.content;
      const title = page.title;
      if (title) $("#scmodal .modal-title").html(title);
      $("#scmodal .modal-body").html(modalContent);
      new bootstrap.Modal($("#scmodal")).show();
      // onOpen onClose initialize_page?
    }
  } catch (error) {
    parent.showAlerts([
      {
        type: "error",
        msg: error.message ? error.message : "An error occured.",
      },
    ]);
  }
}

function closeModal() {
  $("#scmodal").modal("toggle");
}

async function local_post(url, args) {
  try {
    showLoadSpinner();
    const result = await parent.router.resolve({
      pathname: `post${url}`,
      data: args,
    });
    if (result.redirect) await parent.handleRoute(result.redirect);
    else common_done(result, "", false);
  } catch (error) {
    parent.errorAlert(error);
  } finally {
    removeLoadSpinner();
  }
}

async function local_post_json(url, data, cb) {
  try {
    showLoadSpinner();
    const result = await parent.router.resolve({
      pathname: `post${url}`,
      data: data,
      query: parent.currentQuery(),
    });
    if (result.server_eval) await evalServerCode(url);
    if (result.redirect) await parent.handleRoute(result.redirect);
    else common_done(result, "", false);
    if (cb?.success) cb.success(result);
  } catch (error) {
    parent.errorAlert(error);
    if (cb?.error) cb.error(error);
  } finally {
    removeLoadSpinner();
  }
}

async function evalServerCode(url) {
  await parent.apiCall({
    method: "POST",
    path: url,
  });
}

async function make_unique_field(
  id,
  table_id,
  field_name,
  elem,
  space,
  start,
  always_append,
  char_type
) {
  const value = $(elem).val();
  if (!value) return;
  const path = `/api/${table_id}?approximate=true&${encodeURIComponent(
    field_name
  )}=${encodeURIComponent(value)}&fields=${encodeURIComponent(field_name)}`;
  try {
    // TODO ch support local tables
    const response = await parent.apiCall({
      method: "GET",
      path,
    });
    if (response.data.success) {
      unique_field_from_rows(
        response.data.success,
        id,
        field_name,
        space,
        start,
        always_append,
        char_type,
        value
      );
    }
  } catch (error) {
    parent.showAlerts([
      {
        type: "error",
        msg: "unable to 'make_unique_field'",
      },
    ]);
    console.error(error);
  }
}

function openFile(fileId) {
  // TODO fileIds with whitespaces do not work
  const config = parent.saltcorn.data.state.getState().mobileConfig;
  const serverPath = config.server_path;
  const token = config.jwt;
  const url = `${serverPath}/files/serve/${fileId}?jwt=${token}`;
  parent.cordova.InAppBrowser.open(
    url,
    "_self",
    "clearcache=yes,clearsessioncache=yes,location=no"
  );
}

async function select_id(id) {
  try {
    showLoadSpinner();
    const newQuery = updateQueryStringParameter(
      parent.currentQuery(),
      "id",
      id
    );
    await parent.handleRoute(parent.currentLocation(), newQuery);
  } finally {
    removeLoadSpinner();
  }
}

async function check_state_field(that) {
  try {
    showLoadSpinner();
    const name = that.name;
    const newQuery = that.checked
      ? updateQueryStringParameter(parent.currentQuery(), name, that.value)
      : removeQueryStringParameter(name);
    await parent.handleRoute(parent.currentLocation(), newQuery);
  } finally {
    removeLoadSpinner();
  }
}

async function clear_state() {
  try {
    showLoadSpinner();
    await parent.handleRoute(parent.currentLocation(), undefined);
  } finally {
    removeLoadSpinner();
  }
}

async function view_post(viewname, route, data, onDone, sendState) {
  const buildQuery = () => {
    const query = parent.currentQuery();
    return query ? `?${query}` : "";
  };
  const mobileConfig = parent.saltcorn.data.state.getState().mobileConfig;
  const view = parent.saltcorn.data.models.View.findOne({ name: viewname });
  try {
    showLoadSpinner();
    let respData = undefined;
    const query = sendState ? buildQuery() : "";
    if (
      mobileConfig.isOfflineMode ||
      (view?.table_id && mobileConfig.localTableIds.indexOf(view.table_id) >= 0)
    ) {
      respData = await parent.router.resolve({
        pathname: `post/view/${viewname}/${route}`,
        data,
        query,
      });
    } else {
      const response = await parent.apiCall({
        method: "POST",
        path: "/view/" + viewname + "/" + route + query,
        body: data,
      });
      if (response) respData = response.data;
    }

    if (!respData)
      throw new Error(`The response of '${viewname}/${route}' is ${respData}`);
    if (onDone) onDone(respData);
    common_done(respData, viewname, false);
  } catch (error) {
    parent.errorAlert(error);
  } finally {
    removeLoadSpinner();
  }
}

function setNetworSwitcherOn() {
  $("#networkModeSwitcherId").prop("checked", true);
  $("#onlineDescId").prop("class", "d-block");
  $("#offlineDescId").prop("class", "d-none");
}

function setNetworkSwitcherOff() {
  $("#networkModeSwitcherId").prop("checked", false);
  $("#onlineDescId").prop("class", "d-none");
  $("#offlineDescId").prop("class", "d-block");
}

async function switchNetworkMode() {
  try {
    const state = parent.saltcorn.data.state.getState();
    const { isOfflineMode, networkState } = state.mobileConfig;
    if (!isOfflineMode) {
      await parent.offlineHelper.startOfflineMode();
      parent.clearHistory();
      parent.addRoute({ route: "/" });
      parent.addRoute({ route: "get/sync/sync_settings" });
      parent.showAlerts(
        [
          {
            type: "info",
            msg: parent.offlineHelper.getOfflineMsg(),
          },
        ],
        false
      );
      parent.clearAlerts();
    } else {
      if (networkState === "none")
        throw new Error("No internet connection is available.");
      await parent.offlineHelper.endOfflineMode();
      parent.clearHistory();
      parent.addRoute({ route: "/" });
      parent.addRoute({ route: "get/sync/sync_settings" });
      parent.showAlerts([
        {
          type: "info",
          msg: "You are online again.",
        },
      ]);
      parent.clearTopAlerts();
    }
  } catch (error) {
    parent.showAlerts([
      {
        type: "error",
        msg: `Unable to change the network mode: ${
          error.message ? error.message : "Unknown error"
        }`,
      },
    ]);
  } finally {
    const { isOfflineMode } =
      parent.saltcorn.data.state.getState().mobileConfig;
    if (isOfflineMode) setNetworkSwitcherOff();
    else setNetworSwitcherOn();
  }
}

async function callSync() {
  try {
    const mobileConfig = parent.saltcorn.data.state.getState().mobileConfig;
    if (mobileConfig.networkState === "none") {
      parent.showAlerts([
        {
          type: "error",
          msg: "You don't have an internet connection.",
        },
      ]);
    } else {
      const wasOffline = mobileConfig.isOfflineMode;
      showLoadSpinner();
      await parent.offlineHelper.sync();
      parent.clearAlerts();
      if (!wasOffline) {
        parent.showAlerts([
          {
            type: "info",
            msg: "Synchronized your offline data.",
          },
        ]);
      } else {
        setNetworSwitcherOn();
        parent.clearHistory();
        parent.addRoute({ route: "/" });
        parent.addRoute({ route: "get/sync/sync_settings" });
        parent.showAlerts([
          {
            type: "info",
            msg: "Synchronized your offline data, you are online again.",
          },
        ]);
        parent.clearTopAlerts();
      }
    }
  } catch (error) {
    console.log(error);
    parent.errorAlert(error);
  } finally {
    removeLoadSpinner();
  }
}

async function deleteOfflineDataClicked() {
  const lastOfflineSession = await parent.offlineHelper.getLastOfflineSession();
  const { user_name } = parent.saltcorn.data.state.getState().mobileConfig;
  if (!lastOfflineSession?.offlineUser) {
    parent.showAlerts([
      {
        type: "error",
        msg: "You don't have any offline data.",
      },
    ]);
  } else if (lastOfflineSession.offlineUser !== user_name) {
    parent.showAlerts([
      {
        type: "error",
        msg: `The offline data is owned by '${lastOfflineSession.offlineUser}'.`,
      },
    ]);
  } else {
    mobile_modal("/sync/ask_delete_offline_data");
  }
}

async function deleteOfflineData(noFeedback) {
  const mobileConfig = parent.saltcorn.data.state.getState().mobileConfig;
  try {
    mobileConfig.inLoadState = true;
    if (!noFeedback) showLoadSpinner();
    await parent.offlineHelper.clearLocalData(false);
    await parent.offlineHelper.setHasOfflineData(false);
    if (!noFeedback)
      parent.showAlerts([
        {
          type: "info",
          msg: "Deleted your offline data.",
        },
      ]);
  } catch (error) {
    parent.errorAlert(error);
  } finally {
    mobileConfig.inLoadState = false;
    if (!noFeedback) removeLoadSpinner();
  }
}

function showLoadSpinner() {
  if (!parent.isHtmlFile() && $("#scspinner").length === 0) {
    $("body").append(`
    <div 
      id="scspinner" 
      style="position: absolute;
        top: 0px;
        width: 100%;
        height: 100%;
        z-index: 9999;"
    >
      <div 
        style="position: absolute;
          left: 50%;
          top: 50%;
          height: 60px;
          width: 250px;
          margin: 0px auto;"
      >
        <span 
          class="spinner-border d-block"
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </span>
        <span 
          style="margin-left: -125px"
          id="scspinner-text-id"
          class="d-none fs-5 fw-bold bg-secondary text-white p-1 rounded"
        >
        </span>
      </div>
    </div>`);
  }
}

function removeLoadSpinner() {
  if (!parent.isHtmlFile()) $("#scspinner").remove();
}

/**
 * is called when an input with capture=camera is used
 * It takes a picture with the camera plugin, saves the file, and adds the filename as a hidden input.
 * @param {*} fieldName
 */
async function getPicture(fieldName) {
  const cameraOptions = {
    quality: 50,
    encodingType: parent.Camera.EncodingType.JPEG,
    destinationType: parent.Camera.DestinationType.FILE_URI,
  };
  const getPictureWithPromise = () => {
    return new Promise((resolve, reject) => {
      parent.navigator.camera.getPicture(
        (imageDate) => {
          return resolve(imageDate);
        },
        (message) => {
          return reject(message);
        },
        cameraOptions
      );
    });
  };
  try {
    const form = $(`#cptbtn${fieldName}`).closest("form");
    const onsubmit = form.attr("onsubmit");
    form.attr("onsubmit", "javascript:void(0)");
    const fileURI = await getPictureWithPromise();
    form.attr("onsubmit", onsubmit);
    const inputId = `input${fieldName}`;
    form.find(`#${inputId}`).remove();
    form.append(
      `<input class="d-none" id="${inputId}" name="${fieldName}" value="${fileURI}" mobile-camera-input="true" />`
    );
    const tokens = fileURI.split("/");
    $(`#cpt-file-name-${fieldName}`).text(tokens[tokens.length - 1]);
  } catch (error) {
    parent.errorAlert(error);
  }
}

async function updateMatchingRows(e, viewname) {
  try {
    const form = $(e).closest("form");
    await formSubmit(
      form[0],
      "/view/",
      `${viewname}/update_matching_rows`,
      false,
      true
    );
  } catch (error) {
    parent.errorAlert(error);
  }
}

function reload_on_init() {
  console.log("not yet supported");
}
