import axiosLib from "axios";
const axios: any = axiosLib;
import * as State from "../db/state.js";

declare let global: any;

const baseURL = "http://localhost:3000";

// Node's axios has no browser cookie jar, so the session cookie has to be
// tracked and attached by hand. Registered once on the shared default axios
// instance, so it also covers view.ts's own internal axios calls for remote
// queries (it imports the same default axios module).
let sessionCookie: string | undefined;
axios.interceptors.request.use((config: any) => {
  if (sessionCookie) {
    config.headers = config.headers || {};
    config.headers["Cookie"] = sessionCookie;
  }
  return config;
});
axios.interceptors.response.use((response: any) => {
  const setCookie = response.headers?.["set-cookie"];
  if (setCookie)
    sessionCookie = setCookie.map((c: string) => c.split(";")[0]).join("; ");
  return response;
});

const fetchCsrfToken = async (): Promise<string> => {
  const res = await axios.get(`${baseURL}/auth/csrf-token`);
  return res.data.csrfToken;
};

export const prepareQueryEnviroment = async () => {
  // isNode() checks for the absence of a global `window`, which is how view
  // templates decide to render mobile-style markup (e.g. execLink onclick
  // instead of a plain href) - set it to simulate the mobile/webview context
  // these remote-query tests are meant to exercise.
  global.window = {};
  const csrfToken = await fetchCsrfToken();
  const loginRes = await axios.post(
    `${baseURL}/auth/login-with/session`,
    { email: "admin@foo.com", password: "AhGGr6rhu45" },
    { headers: { "CSRF-Token": csrfToken } }
  );
  if (!loginRes.data.success) throw new Error("Test admin login failed");
  // req.login() regenerates the session, so the pre-login CSRF token is stale.
  const state = await State.getState();
  state!.mobileConfig = {
    hasSession: true,
    csrfToken: await fetchCsrfToken(),
  } as any;
};

export const sendViewToServer = async (view: any) => {
  let copy = JSON.parse(JSON.stringify(view));
  copy.id = undefined;
  const state = await State.getState();
  await axios.post(`${baseURL}/viewedit/test/inserter`, copy, {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "CSRF-Token": state!.mobileConfig?.csrfToken,
    },
  });
};

export const deleteViewFromServer = async (id: number) => {
  const state = await State.getState();
  await axios.post(
    `${baseURL}/viewedit/delete/${id}`,
    {},
    {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "CSRF-Token": state!.mobileConfig?.csrfToken,
      },
    }
  );
};

export const renderEditInEditConfig = {
  innerEdit: {
    layout: {
      above: [
        {
          style: {},
          widths: [2, 10],
          besides: [
            {
              above: [
                null,
                {
                  font: "",
                  type: "blank",
                  block: false,
                  style: {},
                  inline: false,
                  contents: "Date",
                  labelFor: "date",
                  isFormula: {},
                  textStyle: "",
                },
              ],
            },
            {
              above: [
                null,
                {
                  type: "field",
                  block: false,
                  fieldview: "editDay",
                  textStyle: "",
                  field_name: "date",
                  configuration: {},
                },
              ],
            },
          ],
          breakpoints: ["", ""],
        },
        {
          type: "line_break",
        },
        {
          style: {},
          widths: [2, 10],
          besides: [
            {
              above: [
                null,
                {
                  font: "",
                  type: "blank",
                  block: false,
                  style: {},
                  inline: false,
                  contents: "Normalised",
                  labelFor: "normalised",
                  isFormula: {},
                  textStyle: "",
                },
              ],
            },
            {
              above: [
                null,
                {
                  type: "field",
                  block: false,
                  fieldview: "edit",
                  textStyle: "",
                  field_name: "normalised",
                  configuration: {},
                },
              ],
            },
          ],
          breakpoints: ["", ""],
        },
        {
          type: "line_break",
        },
        {
          style: {},
          widths: [2, 10],
          besides: [
            {
              above: [
                null,
                {
                  font: "",
                  type: "blank",
                  block: false,
                  style: {},
                  inline: false,
                  contents: "Temperature",
                  labelFor: "temperature",
                  isFormula: {},
                  textStyle: "",
                },
              ],
            },
            {
              above: [
                null,
                {
                  type: "field",
                  block: false,
                  fieldview: "edit",
                  textStyle: "",
                  field_name: "temperature",
                  configuration: {},
                },
              ],
            },
          ],
          breakpoints: ["", ""],
        },
      ],
    },
    columns: [
      {
        type: "Field",
        block: false,
        fieldview: "editDay",
        textStyle: "",
        field_name: "date",
        configuration: {},
      },
      {
        type: "Field",
        block: false,
        fieldview: "edit",
        textStyle: "",
        field_name: "normalised",
        configuration: {},
      },
      {
        type: "Field",
        block: false,
        fieldview: "edit",
        textStyle: "",
        field_name: "temperature",
        configuration: {},
      },
    ],
  },
  outerEdit: {
    layout: {
      above: [
        {
          style: {},
          widths: [2, 10],
          besides: [
            {
              above: [
                null,
                {
                  font: "",
                  type: "blank",
                  block: false,
                  style: {},
                  inline: false,
                  contents: "Favourite book",
                  labelFor: "favbook",
                  isFormula: {},
                  textStyle: "",
                },
              ],
            },
            {
              above: [
                null,
                {
                  type: "field",
                  block: false,
                  fieldview: "select",
                  textStyle: "",
                  field_name: "favbook",
                  configuration: {},
                },
              ],
            },
          ],
          breakpoints: ["", ""],
        },
        {
          type: "line_break",
        },
        {
          style: {
            "margin-bottom": "1.5rem",
          },
          widths: [2, 10],
          besides: [
            {
              above: [
                null,
                {
                  font: "",
                  type: "blank",
                  block: false,
                  style: {},
                  inline: false,
                  contents: "Name",
                  labelFor: "name",
                  isFormula: {},
                  textStyle: "",
                },
              ],
            },
            {
              above: [
                null,
                {
                  type: "field",
                  block: false,
                  fieldview: "edit",
                  textStyle: "",
                  field_name: "name",
                  configuration: {},
                },
              ],
            },
          ],
          breakpoints: ["", ""],
        },
        {
          style: {},
          widths: [2, 10],
          besides: [
            {
              above: [
                null,
                {
                  font: "",
                  type: "blank",
                  block: false,
                  style: {},
                  inline: false,
                  contents: "Parent",
                  labelFor: "parent",
                  isFormula: {},
                  textStyle: "",
                },
              ],
            },
            {
              above: [
                null,
                {
                  type: "field",
                  block: false,
                  fieldview: "select",
                  textStyle: "",
                  field_name: "parent",
                  configuration: {},
                },
              ],
            },
          ],
          breakpoints: ["", ""],
        },
        {
          type: "line_break",
        },
        {
          name: "2d9725",
          type: "view",
          view: "ChildList:innerReads.readings.patient_id",
          state: "shared",
          configuration: {},
        },
        {
          type: "action",
          block: false,
          rndid: "8b4200",
          minRole: 100,
          isFormula: {},
          action_icon: "",
          action_name: "Save",
          action_size: "",
          action_bgcol: "",
          action_label: "",
          action_style: "btn-primary",
          configuration: {},
          action_textcol: "",
          action_bordercol: "",
        },
        {
          type: "action",
          block: false,
          rndid: "9ae75c",
          confirm: false,
          minRole: 100,
          isFormula: {},
          action_icon: "",
          action_name: "Reset",
          action_label: "",
          configuration: {},
        },
        {
          type: "action",
          block: false,
          rndid: "621bba",
          confirm: true,
          minRole: 100,
          isFormula: {},
          action_icon: "",
          action_name: "Delete",
          action_size: "",
          action_bgcol: "",
          action_label: "",
          action_style: "btn-primary",
          configuration: {},
          action_textcol: "",
          action_bordercol: "",
        },
      ],
    },
    columns: [
      {
        type: "Field",
        block: false,
        fieldview: "select",
        textStyle: "",
        field_name: "favbook",
        configuration: {},
      },
      {
        type: "Field",
        block: false,
        fieldview: "edit",
        textStyle: "",
        field_name: "name",
        configuration: {},
      },
      {
        type: "Field",
        block: false,
        fieldview: "select",
        textStyle: "",
        field_name: "parent",
        configuration: {},
      },
      {
        type: "Action",
        rndid: "8b4200",
        minRole: 100,
        isFormula: {},
        action_icon: "",
        action_name: "Save",
        action_size: "",
        action_bgcol: "",
        action_label: "",
        action_style: "btn-primary",
        configuration: {},
        action_textcol: "",
        action_bordercol: "",
      },
      {
        type: "Action",
        rndid: "9ae75c",
        confirm: false,
        minRole: 100,
        isFormula: {},
        action_icon: "",
        action_name: "Reset",
        action_label: "",
        configuration: {},
      },
      {
        type: "Action",
        rndid: "621bba",
        confirm: true,
        minRole: 100,
        isFormula: {},
        action_icon: "",
        action_name: "Delete",
        action_size: "",
        action_bgcol: "",
        action_label: "",
        action_style: "btn-primary",
        configuration: {},
        action_textcol: "",
        action_bordercol: "",
      },
    ],
  },
};
