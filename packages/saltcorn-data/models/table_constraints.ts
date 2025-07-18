/**
 * TableConstraint Database Access Layer
 * @category saltcorn-data
 * @module models/table_constraints
 * @subcategory models
 */
import {
  type Where,
  type SelectOptions,
  ftsFieldsSqlExpr,
  PartialSome,
} from "@saltcorn/db-common/internal";
import db from "../db";
import type Field from "./field";
const { stringToJSON } = require("../utils");
import type Table from "./table";
import _expr from "./expression";
import { FieldLike } from "@saltcorn/types/base_types";
const { add_free_variables_to_joinfields, freeVariables, jsexprToSQL } = _expr;
/**
 * TableConstraint class
 * @category saltcorn-data
 */
class TableConstraint {
  table_id?: number;
  type: TypeOption;
  id?: number | null;
  configuration: any;
  table?: Table;
  /**
   * @param {object} o
   */
  constructor(o: TableConstraintCfg) {
    if (!o.table_id && !o.table)
      throw new Error(`Please specify ether 'table._id' or 'table'.`);
    if (o.table_id) this.table_id = +o.table_id;
    if (o.table) {
      this.table_id = o.table.id;
    }
    this.type = o.type;
    this.id = !o.id ? null : +o.id;
    this.configuration = stringToJSON(o.configuration) || {};
  }

  /**
   * @type {object}
   */
  get toJson(): { type: TypeOption; configuration: any } {
    return {
      type: this.type,
      configuration: this.configuration,
    };
  }

  /**
   * @param {*} where
   * @param {*} selectopts
   * @returns {Promise<TableConstraint[]>}
   */
  static async find(
    where: Where,
    selectopts?: SelectOptions
  ): Promise<Array<TableConstraint>> {
    const db_flds = await db.select("_sc_table_constraints", where, selectopts);
    return db_flds.map((dbf: TableConstraintCfg) => new TableConstraint(dbf));
  }

  /**
   * @param {*} where
   * @returns {Promise<TableConstraint>}
   */
  static async findOne(where: Where): Promise<TableConstraint | null> {
    const p = await db.selectMaybeOne("_sc_table_constraints", where);
    return p ? new TableConstraint(p) : null;
  }

  /**
   * @param {*} f
   * @returns {Promise<TableConstraint>}
   */
  static async create(f: TableConstraintCfg): Promise<TableConstraint> {
    const con = new TableConstraint(f);

    const Table = require("./table");
    const table = Table.findOne({ id: con.table_id });
    if (con.type === "Unique" && con.configuration.fields) {
      await db.add_unique_constraint(table.name, con.configuration.fields);
    } else if (con.type === "Index" && con.configuration.field === "_fts") {
      const hasIncludeFts = table.fields.filter(
        (f: FieldLike) => f.attributes?.include_fts
      );
      if (hasIncludeFts) await table.move_include_fts_to_search_context();
      const text_fields = ftsFieldsSqlExpr(
        table.fields,
        table.name,
        db.getTenantSchema()
      );
      const language = require("../db/state").getState().pg_ts_config;
      const search_disable_fts = require("../db/state")
        .getState()
        .getConfig("search_disable_fts");
      await db.add_fts_index(
        table.name,
        text_fields,
        language,
        search_disable_fts
      );
    } else if (con.type === "Index") {
      await db.add_index(table.name, con.configuration.field);
    }

    const { id, ...rest } = con;
    const fid = await db.insert("_sc_table_constraints", rest);
    con.id = fid;

    if (con.type === "Formula" && !db.isSQLite) {
      // implement in db if no join fields
      const jfs = {};
      add_free_variables_to_joinfields(
        freeVariables(con.configuration.formula),
        jfs,
        table.fields
      );
      if (Object.keys(jfs).length === 0)
        try {
          const sql = jsexprToSQL(con.configuration.formula);
          const schema = db.getTenantSchemaPrefix();
          await db.query(
            `alter table ${schema}"${db.sqlsanitize(
              table.name
            )}" add constraint "${db.sqlsanitize(
              table.name
            )}_fml_${fid}" CHECK (${sql});`
          );
        } catch (e) {
          //cannot implement as SQL
          //console.error(e);
          //ignore
        }
    }
    if (!db.getRequestContext()?.client)
      await require("../db/state").getState().refresh_tables(true);

    return con;
  }

  /**
   * @returns {Promise<void>}
   */
  async delete(): Promise<void> {
    await db.deleteWhere("_sc_table_constraints", { id: this.id });
    const Table = require("./table");
    const table = Table.findOne({ id: this.table_id });
    if (this.type === "Unique" && this.configuration.fields) {
      await db.drop_unique_constraint(table.name, this.configuration.fields);
    } else if (this.type === "Index" && this.configuration?.field === "_fts") {
      await db.drop_fts_index(table.name);
    } else if (this.type === "Index") {
      await db.drop_index(table.name, this.configuration.field);
    } else if (this.type === "Formula" && !db.isSQLite) {
      const schema = db.getTenantSchemaPrefix();
      await db.query(
        `alter table ${schema}"${db.sqlsanitize(
          table.name
        )}" drop constraint IF EXISTS "${db.sqlsanitize(table.name)}_fml_${
          this.id
        }";`
      );
    }
    if (!db.getRequestContext()?.client)
      await require("../db/state").getState().refresh_tables(true);
  }

  /**
   * @param {*} table
   * @param {*} field
   * @returns {Promise<void>}
   */
  static async delete_field_constraints(
    table: Table,
    field: Field
  ): Promise<void> {
    const tblcs = await TableConstraint.find({ table_id: table.id });
    for (const c of tblcs) {
      if (c.configuration.fields && c.configuration.fields.includes(field.name))
        await c.delete();
    }
    if (!db.getRequestContext()?.client)
      await require("../db/state").getState().refresh_tables(true);
  }

  /**
   * @type {string[]}
   */
  static get type_options(): Array<TypeOption> {
    return [...type_options];
  }
}

// type union from array with const assertion
const type_options = ["Unique", "Index", "Formula"] as const;
type TypeOption = (typeof type_options)[number];

type TableConstraintCfg = PartialSome<TableConstraint, "type">;

export = TableConstraint;
