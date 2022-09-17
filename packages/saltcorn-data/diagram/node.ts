export type NodeType = "view" | "page" | "table" | "trigger" | "dummy";

/**
 * resembles a page or a view in the application object tree
 */
export default class Node {
  type: NodeType;
  label: string;
  cyId: string;
  linked = new Array<Node>();
  embedded = new Array<Node>();
  tables = new Array<Node>();
  trigger = new Array<Node>();

  /**
   * @param type saltcorn-entity type
   * @param label
   */
  constructor(type: NodeType, label: string) {
    this.type = type;
    this.label = label;
    this.cyId = `${type}_${label}`;
  }
}
