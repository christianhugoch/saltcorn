import Node from "./node";

/**
 * aligns the nodes from the application object tree on a raster
 */
export default class CytoscapeRaster {
  private raster: Array<Array<Node | null>>;
  private cyIds = new Set<string>();
  private links = new Array<Link>();

  private initialRows = 2;
  private initialCols = 2;

  private entryNodeRow = 10;
  private entryNodeCol = 0;

  constructor(entryNode: Node) {
    this.raster = new Array<Array<Node>>();
    for (let row = 0; row < this.initialRows; row++) {
      const row = new Array<Node | null>();
      for (let col = 0; col < this.initialCols; col++) row.push(null);

      this.raster.push(row);
    }
    this.addNode(entryNode, this.entryNodeRow, this.entryNodeCol);
    this.handleLinkedNodes(entryNode, this.entryNodeRow, this.entryNodeCol);
  }

  private addNode(node: Node, row: number, col: number) {
    this.enlargeIfNecessary(row, col);
    this.raster[row][col] = node;
    this.cyIds.add(node.cyId);
  }

  private handleLinkedNodes(
    parent: Node,
    parentRow: number,
    parentCol: number
  ) {
    const multipleNewNodes =
      parent.linked.filter((node: Node) => {
        return !this.cyIds.has(node.cyId);
      }).length > 1;
    let insertRow = multipleNewNodes ? parentRow - 1 : parentRow;
    let insertCol = parentCol + 4;
    for (const node of parent.linked) {
      if (!this.cyIds.has(node.cyId)) {
        this.addNode(node, insertRow, insertCol);
        this.handleLinkedNodes(node, insertRow, insertCol);
        insertRow += 2;
        this.links.push({ source: parent, target: node, type: "new_target" });
      } else {
        this.links.push({
          source: parent,
          target: node,
          type: "existing_target",
        });
      }
    }
  }

  public buildCyNodes(): any[] {
    const cyNodes = new Array<any>();
    const rowsCount = this.rowsCount();
    const colsCount = this.colsCount();
    for (let row = 0; row < rowsCount; row++) {
      for (let col = 0; col < colsCount; col++) {
        const node = this.raster[row][col];
        if (node) {
          cyNodes.push({
            data: {
              id: node.cyId,
              type: node.type,
              label: node.label,
            },
            position: {
              x: col * 100,
              y: row * 100,
            },
          });
        }
      }
    }
    return cyNodes;
  }

  public buildCyEdges(): any[] {
    return this.links.map((link: Link) => {
      return {
        data: {
          id: `${link.source.cyId}-${link.target.cyId}`,
          source: link.source.cyId,
          target: link.target.cyId,
          type: link.type,
        },
      };
    });
  }

  rowsCount(): number {
    return this.raster.length;
  }

  colsCount(): number {
    return this.raster[0].length;
  }

  private enlargeIfNecessary(row: number, col: number) {
    const currentColSize = this.raster[0].length;
    if (row >= this.raster.length) {
      const diff = row - this.raster.length;
      for (let i = 0; i <= diff; i++) {
        const newRow = new Array<Node | null>();
        for (let j = 0; j < currentColSize; j++) newRow.push(null);
        this.raster.push(newRow);
      }
    }
    if (col >= currentColSize) {
      const diff = col - currentColSize;
      for (let i = 0; i < this.raster.length; i++) {
        for (let j = 0; j <= diff; j++) this.raster[i].push(null);
      }
    }
  }
}

type Link = {
  source: Node;
  target: Node;
  type: string;
};
