/**
 * @category saltcorn-sbadmin2
 * @module saltcorn-sbadmin2/index
 */

const {
  ul,
  li,
  a,
  span,
  hr,
  div,
  text,
  i,
  h6,
  h1,
  p,
  header,
  img,
  footer,
  button,
  form,
  input,
} = require("@saltcorn/markup/tags");
const renderLayout = require("@saltcorn/markup/layout");
const { renderForm, link } = require("@saltcorn/markup");
const {
  toast,
  headersInHead,
  headersInBody,
  show_icon,
  activeChecker,
} = require("@saltcorn/markup/layout_utils");
const db = require("@saltcorn/data/db");
const { isNode } = require("@saltcorn/data/utils");

const verstring = "@" + require("./package.json").version;

/**
 * @param {string} currentUrl
 * @returns {function}
 */
const subItem = (currentUrl) => (item) =>
  item.subitems
    ? div(
        { class: "dropdown-item btn-group dropend" },
        a(
          {
            type: "button",
            class: "dropdown-item dropdown-toggle p-0",
            "data-bs-toggle": "dropdown",
            "aria-expanded": "false",
          },
          item.label
        ),
        ul(
          { class: "dropdown-menu" },
          item.subitems.map((si1) => li(subItem(currentUrl)(si1)))
        )
      )
    : item.link
      ? a(
          {
            class: [
              "collapse-item",
              active(currentUrl, item) && "active",
              item.class,
            ],
            href: text(item.link),
            target: item.target_blank ? "_blank" : undefined,
          },
          show_icon(item.icon, "mr-05"),
          item.label
        )
      : item.type === "Separator"
        ? hr({ class: "sidebar-divider my-0" })
        : h6({ class: "collapse-header" }, item.label);

/**
 * @param {object} item
 * @returns {string}
 */
const labelToId = (item) => text(item.label.replace(" ", ""));

/**
 * @param {object} x
 * @param {object} s
 * @returns {object}
 */
const logit = (x, s) => {
  if (s) console.log(s, x);
  else console.log(x);
  return x;
};

/**
 * @param {string} currentUrl
 * @param {object} item
 * @returns {boolean}
 */
const active = (currentUrl, item) =>
  (item.link && activeChecker(item.link, currentUrl)) ||
  (item.altlinks && item.altlinks.some((l) => activeChecker(l, currentUrl))) ||
  (item.subitems &&
    item.subitems.some(
      (si) =>
        (si.link && activeChecker(si.link, currentUrl)) ||
        (si.altlinks && si.altlinks.some((l) => activeChecker(l, currentUrl)))
    ));

/**
 * @param {string} currentUrl
 * @returns {function}
 */
const sideBarItem = (currentUrl) => (item) => {
  const is_active = active(currentUrl, item);
  if (item.type === "Separator") return hr({ class: "sidebar-divider my-0" });
  return li(
    { class: ["nav-item", is_active && "active"] },
    item.subitems
      ? [
          a(
            {
              class: [
                "nav-link",
                !is_active && "collapsed",
                item.isUser && "user-nav-section-with-span",
              ],
              href: "#",
              "data-bs-toggle": "collapse",
              "data-bs-target": `#collapse${labelToId(item)}`,
              "aria-expanded": "true",
              "aria-controls": `collapse${labelToId(item)}`,
            },
            show_icon(item.icon),
            span(text(item.label))
          ),
          div(
            {
              id: `collapse${labelToId(item)}`,
              class: ["collapse", is_active && "show"],
              "data-parent": "#accordionSidebar",
            },
            div(
              { class: "bg-white py-2 collapse-inner rounded" },
              item.subitems.map(subItem(currentUrl))
            )
          ),
        ]
      : item.link
        ? a(
            {
              class: "nav-link",
              href: text(item.link),
              target: item.target_blank ? "_blank" : undefined,
            },
            show_icon(item.icon),
            span(text(item.label))
          )
        : item.type === "Search"
          ? form(
              {
                action: "/search",
                class: "menusearch ms-2 me-3",
                method: "get",
              },
              div(
                { class: "input-group search-bar" },

                input({
                  type: "search",
                  class: "form-control search-bar pl-2p5",
                  placeholder: item.label,
                  id: "inputq",
                  name: "q",
                  "aria-label": "Search",
                  "aria-describedby": "button-search-submit",
                }),

                button(
                  {
                    class: "btn btn-outline-secondary search-bar",
                    type: "submit",
                  },
                  i({ class: "fas fa-search" })
                )
              )
            )
          : span({ class: "nav-link" }, text(item.label))
  );
};

/**
 * @param {string} currentUrl
 * @returns {function}
 */
const sideBarSection = (currentUrl) => (section) => [
  section.section &&
    hr({ class: "sidebar-divider" }) +
      div({ class: "sidebar-heading" }, section.section),
  section.items.map(sideBarItem(currentUrl)).join(""),
];

/**
 * @param {object} brand
 * @param {string[]} sections
 * @param {string} currentUrl
 * @returns {ul}
 */
const sidebar = (brand, sections, currentUrl) =>
  ul(
    {
      class: "navbar-nav sidebar sidebar-dark accordion d-print-none",
      id: "accordionSidebar",
    },
    a(
      {
        class: "sidebar-brand d-flex align-items-center justify-content-center",
        href: "/",
      },
      brand.logo &&
        div(
          { class: "sidebar-brand-icon" },
          img({ src: brand.logo, width: "35", height: "35", alt: "Logo" })
        ),
      div({ class: "sidebar-brand-text mx-3" }, brand.name)
    ),
    sections.map(sideBarSection(currentUrl)),
    hr({ class: "sidebar-divider d-none d-md-block" }),
    div(
      { class: "text-center d-none d-md-inline" },
      button({
        class: "rounded-circle border-0",
        "data-sidebar-toggler": true,
        id: "sidebarToggle",
      })
    )
  );

/**
 * @namespace
 * @category saltcorn-sbadmin2
 */
const blockDispatch = {
  /**
   *
   * @param {object} opts
   * @param {string} opts.title
   * @param {string} opts.blurb
   * @returns {div}
   */
  pageHeader: ({ title, blurb }) =>
    div(
      h1({ class: "h3 mb-0 mt-2 text-gray-800" }, title),
      blurb && p({ class: "mb-0 text-gray-800" }, blurb)
    ),
  /**
   * @param {object} opts
   * @param {string} opts.contents
   * @returns {div}
   */
  footer: ({ contents }) =>
    div(
      { class: "container" },
      footer(
        { id: "footer" },
        div({ class: "row" }, div({ class: "col-sm-12" }, contents))
      )
    ),
  /**
   * @param {object} opts
   * @param {string} opts.caption
   * @param {string} opts.blurb
   * @returns {header}
   */
  hero: ({ caption, blurb }) =>
    header(
      { class: "masthead" },
      div(
        { class: "container h-100" },
        div(
          {
            class:
              "row h-100 align-items-center justify-content-center text-center",
          },
          div(
            { class: "col-lg-10 align-self-end" },
            h1({ class: "text-uppercase fw-bold" }, caption),
            hr({ class: "divider my-4" })
          ),
          div(
            { class: "col-lg-8 align-self-baseline" },
            p({ class: "fw-light mb-5" }, blurb)
            /*a(
              {
                class: "btn btn-primary btn-xl",
                href: "#about"
              },
              "Find Out More"
            )*/
          )
        )
      )
    ),
};

/**
 * Render body
 * @param {string} title
 * @param {string|object} body
 * @param {*} role
 * @returns {string}
 */
const renderBody = (title, body, role, req) =>
  renderLayout({
    blockDispatch,
    role,
    req,
    layout: body,
  });

/**
 * @param {object} authLinks
 * @returns {hr|a}
 */
const renderAuthLinks = (authLinks, req) => {
  const __ = req?.__ || ((s) => s);
  let links = [];
  if (authLinks.login)
    links.push(link(authLinks.login, __("Already have an account? Login!")));
  if (authLinks.forgot)
    links.push(link(authLinks.forgot, __("Forgot password?")));
  if (authLinks.signup)
    links.push(link(authLinks.signup, __("Create an account!")));
  if (authLinks.publicUser)
    links.push(link(authLinks.publicUser, __("Continue as public user")));
  const meth_links = (authLinks.methods || [])
    .map(({ url, icon, label }) =>
      a(
        { href: url, class: "btn btn-secondary btn-user btn-block" },
        icon || "",
        `&nbsp;${__("Login with %s", label)}`
      )
    )
    .join("");
  if (links.length === 0) return hr() + meth_links;
  else
    return (
      hr() +
      (meth_links ? meth_links + hr() : "") +
      links.map((l) => div({ class: "text-center" }, l)).join("")
    );
};

/**
 * @param {Form} form
 * @returns {Form}
 */
const formModify = (form) => {
  form.formStyle = "vert";
  form.submitButtonClass = "btn-primary btn-user btn-block";
  return form;
};

/**
 * omit '/' in a mobile deployment (needed for ios)
 */
const safeSlash = () => (isNode() ? "/" : "");

const linkPrefix = () => (isNode() ? "/plugins" : "sc_plugins");

/**
 * @param {*} headers
 * @param {string} title
 * @param {string} bodyAttr
 * @param {string} rest
 * @returns {string}
 */
const wrapIt = (headers, title, bodyAttr, rest) =>
  `<!doctype html>
  <html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="${linkPrefix()}/public/sbadmin2${verstring}/fontawesome-free/css/all.min.css">
    <link href="${linkPrefix()}/public/sbadmin2${verstring}/nunito/css/nunito/nunito-fontface.css" rel="stylesheet">

    <!-- Custom styles for this template-->
    <link rel="stylesheet" href="${linkPrefix()}/public/sbadmin2${verstring}/sb-admin-2.min.css">
    ${headersInHead(headers)}
    <title>${text(title)}</title>
  </head>
  <body ${bodyAttr}>
    ${rest}
    <script src="${safeSlash()}static_assets/${
      db.connectObj.version_tag
    }/jquery-3.6.0.min.js"></script>
            <script src="${linkPrefix()}/public/sbadmin2${verstring}/bootstrap.bundle.min.js"></script>
            <script src="${linkPrefix()}/public/sbadmin2${verstring}/jquery.easing.min.js"></script>
            <script src="${linkPrefix()}/public/sbadmin2${verstring}/sb-admin-2.min.js"></script>
    ${headersInBody(headers)}
    </body>
  </html>`;

/**
 * @param {object} opts
 * @param {string} opts.title
 * @param {object[]} opts.alerts
 * @param {object} opts.form
 * @param {string} opts.afterForm
 * @param {*} opts.headers
 * @param {string} opts.csrfToken
 * @param {object} opts.authLinks
 * @returns {string}
 */
const authWrap = ({
  title,
  alerts,
  form,
  afterForm,
  headers,
  csrfToken,
  authLinks,
  bodyClass,
  req,
}) =>
  wrapIt(
    headers,
    title,
    `class="bg-gradient-primary ${bodyClass || ""}"`,
    `<div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-10 col-lg-12 col-md-9">
          <div class="card o-hidden border-0 shadow-lg my-5">
            <div class="card-body p-2">
              <div class="row">
                <div class="col">
                  <div class="p-5">
                  <div id="alerts-area">${/* deprecated */ ""}</div>
                    <div class="text-center">
                      <h1 class="h4 text-gray-900 mb-4">${title}</h1>
                    </div>
                    ${renderForm(formModify(form), csrfToken)}
                    ${renderAuthLinks(authLinks, req)}
                    ${afterForm ? afterForm : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div 
        id="toasts-area"
        class="toast-container position-fixed p-2 top-0 ${
          isNode() ? "end-0" : "start-50"
        }
        style: "z-index: 9999;"
        aria-live="polite" 
        aria-atomic="true"
      >
        ${alerts.map((a) => toast(a.type, a.msg)).join("")}
      </div>
    </div>`
  );

/**
 * @param {object} opts
 * @param {string} opts.title
 * @param {menu} opts.menu
 * @param {object} opts.brand
 * @param {object[]} opts.alerts
 * @param {string} opts.currentUrl
 * @param {string|object} opts.body
 * @param {*} opts.headers
 * @param {*} opts.role
 * @returns {string}
 */
const wrap = ({
  title,
  menu,
  brand,
  alerts,
  currentUrl,
  body,
  headers,
  role,
  bodyClass,
  req,
}) =>
  wrapIt(
    headers,
    title,
    `id="page-top" class="${bodyClass || ""}"`,
    `<div id="wrapper">
      ${menu && menu.length > 0 ? sidebar(brand, menu, currentUrl) : ""}

      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <div id="page-inner-content" class="container-fluid px-2 sbadmin2-theme">
            <div id="alerts-area">${/* deprecated */ ""}</div>
            <div>
              ${renderBody(title, body, role, req)}
            <div>
          </div>
        </div>
      </div>
      <div 
        id="toasts-area"
        class="toast-container position-fixed ${
          isNode() ? "top-0 end-0 p-2" : "bottom-0 start-50 p-0"
        } end-0 p-2"
        style: "z-index: 9999; ${!isNode() ? "margin-bottom: 1.0rem" : ""}"
        aria-live="polite"
        aria-atomic="true"
      >
        ${alerts.map((a) => toast(a.type, a.msg)).join("")}
      </div>
    </div>`
  );

/**
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.body
 * @param {object[]} opts.alerts
 * @param {*} opts.role
 * @returns {string}
 */
const exportRenderBody = ({ title, body, alerts, role, req }) =>
  `<div id="alerts-area">${/* deprecated */ ""}</div>
  <div >
    ${renderBody(title, body, role, req)}
  <div>
  <div 
    id="toasts-area"
    class="toast-container position-fixed ${
      isNode() ? "top-0 end-0 p-2" : "bottom-0 start-50 p-0"
    }"
    style: "z-index: 9999; ${!isNode() ? "margin-bottom: 1.0rem" : ""}"
    aria-live="polite"
    aria-atomic="true"
  >
    ${alerts.map((a) => toast(a.type, a.msg)).join("")}
  </div>`;

module.exports = {
  /** @type {number} */
  sc_plugin_api_version: 1,
  plugin_name: "sbadmin2",
  /** @type {object} */
  layout: {
    wrap,
    authWrap,
    renderBody: exportRenderBody,
  },
};
