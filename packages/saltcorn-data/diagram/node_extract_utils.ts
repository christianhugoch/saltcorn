import Node from "./node";
import View from "../models/view";
import Page from "../models/page";
import layout from "../models/layout";
const { traverseSync } = layout;
const {
  parse_view_select,
} = require("../base-plugin/viewtemplates/viewable_fields");

/**
 * builds an object tree that resembles all possible paths from 'entryPage'
 * @param entryPage start of user journey
 * @returns the root node of the object tree
 */
export function buildObjectTree(entryPage: Page): Node {
  const entryNode = new Node("page", entryPage.name);
  const { embeddedViews, linkedViews, linkedPages } = extractFromLayout(
    entryPage.layout
  );
  for (const linkedPage of linkedPages) {
    addLinkedPageNode(entryNode, linkedPage);
  }
  for (const linkedView of linkedViews) {
    addLinkedViewNode(entryNode, linkedView);
  }
  return entryNode;
}

function addLinkedPageNode(oldNode: Node, newPage: Page) {
  const newNode = new Node("page", newPage.name);
  oldNode.linked.push(newNode);
  const { linkedViews, linkedPages } = extractFromLayout(newPage.layout);
  for (const linkedPage of linkedPages) {
    addLinkedPageNode(newNode, linkedPage);
  }
  for (const linkedView of linkedViews) {
    addLinkedViewNode(newNode, linkedView);
  }
}

function addLinkedViewNode(oldNode: Node, newView: View) {
  const newNode = new Node("view", newView.name);
  oldNode.linked.push(newNode);
  const { linkedViews } =
    newView.viewtemplate === "List"
      ? extractFromColumns(newView.configuration.columns)
      : extractFromLayout(newView.configuration.layout);
  for (const linkedView of linkedViews) {
    addLinkedViewNode(newNode, linkedView);
  }
  // check view_to_create
  const { view_to_create, create_view_display } = newView.configuration;
  if (
    view_to_create &&
    (create_view_display === "Link" || create_view_display === "Popup")
  ) {
    const createView = View.findOne({ name: view_to_create });
    if (createView) {
      addLinkedViewNode(newNode, createView);
    }
  }
}

function extractFromLayout(layout: any) {
  const embeddedViews = new Array<View>();
  const linkedPages = new Array<Page>();
  const linkedViews = new Array<View>();
  traverseSync(layout, {
    view(segment: any) {
      const select = parse_view_select(segment.view);
      const view = View.findOne({ name: select.viewname });
      if (view) embeddedViews.push(view);
    },
    view_link(segment: any) {
      const select = parse_view_select(segment.view);
      const view = View.findOne({ name: select.viewname });
      if (view) linkedViews.push(view);
    },
    link(segment: any) {
      if (segment.link_src === "View") {
        const parts = segment.url.split("/");
        const viewName = parts[parts.length - 1];
        const view = View.findOne({ name: viewName });
        linkedViews.push(view!);
      } else if (segment.link_src === "Page") {
        const parts = segment.url.split("/");
        const pagename = parts[parts.length - 1];
        const page = Page.findOne({ name: pagename });
        linkedPages.push(page!);
      }
    },
  });

  return {
    embeddedViews,
    linkedViews,
    linkedPages,
  };
}

function extractFromColumns(columns: any[]) {
  const linkedViews = new Array<View>();
  for (const column of columns) {
    if (column.type === "ViewLink") {
      const select = parse_view_select(column.view);
      const view = View.findOne({ name: select.viewname });
      if (view) linkedViews.push(view);
    }
  }
  return { linkedViews };
}
