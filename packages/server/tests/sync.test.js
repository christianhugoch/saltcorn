const request = require("supertest");
const getApp = require("../app");
const {
  getUserLoginCookie,
  getAdminLoginCookie,
  resetToFixtures,
  respondJsonWith,
} = require("../auth/testhelp");
const db = require("@saltcorn/data/db");
const { sleep } = require("@saltcorn/data/tests/mocks");

const Table = require("@saltcorn/data/models/table");

beforeAll(async () => {
  await resetToFixtures();
});
afterAll(db.close);

jest.setTimeout(10000);

const initSyncInfo = async (tbls) => {
  for (const tbl of tbls) {
    const books = Table.findOne({ name: tbl });
    if (books.has_sync_info) await db.deleteWhere(`${tbl}_sync_info`, {});
    else {
      books.has_sync_info = true;
      await books.update(books);
    }
  }
};

describe("load remote insert/updates", () => {
  if (!db.isSQLite) {
    beforeAll(async () => {
      await initSyncInfo(["books", "publisher"]);
    });
    it("check params", async () => {
      const app = await getApp({ disableCsrf: true });
      const loginCookie = await getAdminLoginCookie();
      await request(app)
        .post("/sync/load_changes")
        .set("Cookie", loginCookie)
        .send({
          syncInfos: {
            books: {},
          },
        })
        .expect(
          respondJsonWith(400, (resp) => resp.error === "loadUntil is missing")
        );
      await request(app)
        .post("/sync/load_changes")
        .set("Cookie", loginCookie)
        .send({
          loadUntil: new Date().valueOf(),
        })
        .expect(
          respondJsonWith(400, (resp) => resp.error === "syncInfos is missing")
        );
    });

    it("without syncFrom", async () => {
      const app = await getApp({ disableCsrf: true });
      const loginCookie = await getAdminLoginCookie();
      const books = Table.findOne({ name: "books" });
      const dbLength = await books.countRows();
      const loadUntil = new Date();
      const resp = await request(app)
        .post("/sync/load_changes")
        .set("Cookie", loginCookie)
        .send({
          loadUntil: loadUntil.valueOf(),
          syncInfos: {
            books: {
              maxLoadedId: 0,
            },
          },
        });
      expect(resp.status).toBe(200);
      const data = resp._body;
      expect(data.books.rows.length).toBe(dbLength);
      for (const row of data.books.rows) {
        const fromDb = await books.getRows({ id: row._sync_info_tbl_ref_ });
        expect(fromDb.length).toBe(1);
        expect(row._sync_info_tbl_last_modified_).toBe(loadUntil.valueOf());
        expect(row._sync_info_tbl_deleted_).toBe(null);
      }
    });

    it("with syncFrom, without sync_infos", async () => {
      const app = await getApp({ disableCsrf: true });
      const loginCookie = await getAdminLoginCookie();
      const loadUntil = new Date();
      const resp = await request(app)
        .post("/sync/load_changes")
        .set("Cookie", loginCookie)
        .send({
          loadUntil: loadUntil.valueOf(),
          syncInfos: {
            books: {
              maxLoadedId: 0,
              syncFrom: 1000,
            },
          },
        });
      expect(resp.status).toBe(200);
      const data = resp._body;
      expect(data.books.rows.length).toBe(0);
    });

    it("with syncFrom, with sync_infos", async () => {
      const app = await getApp({ disableCsrf: true });
      const loginCookie = await getAdminLoginCookie();
      const books = Table.findOne({ name: "books" });
      await books.updateRow({ author: "Herman Melville" }, 1);
      await sleep(200);
      const dbTime = await db.time();
      await books.updateRow({ author: "Leo Tolstoy" }, 2);
      const { last_modified } = await books.latestSyncInfo(2);
      {
        const resp = await request(app)
          .post("/sync/load_changes")
          .set("Cookie", loginCookie)
          .send({
            loadUntil: (await db.time()).valueOf(),
            syncInfos: {
              books: {
                maxLoadedId: 0,
                syncFrom: dbTime.valueOf(),
              },
            },
          });
        expect(resp.status).toBe(200);
        const data = resp._body;
        expect(data.books.rows.length).toBe(1);

        const {
          _sync_info_tbl_ref_,
          _sync_info_tbl_last_modified_,
          _sync_info_tbl_deleted_,
          ...rest
        } = data.books.rows[0];
        expect(_sync_info_tbl_ref_).toBe(2);
        expect(_sync_info_tbl_last_modified_).toBe(last_modified.valueOf());
        expect(_sync_info_tbl_deleted_).toBe(false);
        expect(rest.author).toBe("Leo Tolstoy");
      }
      await books.updateRow({ author: "Herman Melville" }, 1);
      {
        const resp = await request(app)
          .post("/sync/load_changes")
          .set("Cookie", loginCookie)
          .send({
            loadUntil: (await db.time()).valueOf(),
            syncInfos: {
              books: {
                maxLoadedId: 0,
                syncFrom: dbTime.valueOf(),
              },
            },
          });
        expect(resp.status).toBe(200);
        const data = resp._body;
        expect(data.books.rows.length).toBe(2);
        for (const row of data.books.rows) {
          const {
            _sync_info_tbl_ref_,
            _sync_info_tbl_last_modified_,
            _sync_info_tbl_deleted_,
            ...rest
          } = row;
          expect(_sync_info_tbl_ref_).toBe(rest.id);
          const { last_modified } = await books.latestSyncInfo(rest.id);
          expect(_sync_info_tbl_last_modified_).toBe(last_modified.valueOf());
          expect(_sync_info_tbl_deleted_).toBe(false);
        }
        expect(data.books.rows[0].author).toBe("Herman Melville");
        expect(data.books.rows[1].author).toBe("Leo Tolstoy");
      }
    });
  } else
    it("only pq support", () => {
      expect(true).toBe(true);
    });
});

// describe("load remote deletes", () => {});

describe("Upload changes", () => {
  const doUpload = async (app, loginCookie, syncTimestamp, changes) => {
    const resp = await request(app)
      .post("/sync/offline_changes")
      .set("Cookie", loginCookie)
      .send({
        syncTimestamp,
        changes,
      });
    return resp;
  };

  const getResult = async (app, loginCookie, syncDir) => {
    let pollCount = 0;
    while (pollCount < 10) {
      const resp = await request(app)
        .get(`/sync/upload_finished?dir_name=${encodeURIComponent(syncDir)}`)
        .set("Cookie", loginCookie);
      expect(resp.status).toBe(200);
      const { finished, translatedIds, error } = resp._body;
      if (finished) return translatedIds ? translatedIds : error;
      await sleep(1000);
    }
    return null;
  };

  const cleanSyncDir = async (app, loginCookie, syncDir) => {
    const resp = await request(app)
      .post("/sync/clean_sync_dir")
      .send({ dir_name: syncDir })
      .set("Cookie", loginCookie);
    expect(resp.status).toBe(200);
  };

  const maxId = async (tblName) => {
    const table = Table.findOne({ name: tblName });
    const pkName = table.pk_name;
    const rows = await table.getRows({}, { orderBy: pkName, orderDesc: true });
    return rows.length === 0 ? 0 : rows[0][pkName];
  };

  if (!db.isSQLite) {
    beforeAll(async () => {
      await initSyncInfo(["books", "publisher"]);
    });

    it("inserts with translations", async () => {
      const app = await getApp({ disableCsrf: true });
      const loginCookie = await getAdminLoginCookie();
      const resp = await doUpload(app, loginCookie, new Date().valueOf(), {
        books: {
          inserts: [
            {
              id: 1,
              author: "app agi",
              pages: 1,
              publisher: 1,
            },
          ],
        },
        publisher: {
          inserts: [
            {
              id: 1,
              name: "agi",
            },
          ],
        },
      });
      expect(resp.status).toBe(200);
      const { syncDir } = resp._body;
      const translatedIds = await getResult(app, loginCookie, syncDir);
      await cleanSyncDir(app, loginCookie, syncDir);
      expect(translatedIds).toBeDefined();
      expect(translatedIds).toEqual({
        books: {
          1: 3,
        },
        publisher: {
          1: 3,
        },
      });
    });

    it("update with translation", async () => {
      const app = await getApp({ disableCsrf: true });
      const loginCookie = await getAdminLoginCookie();
      const maxPublId = await maxId("publisher");
      const resp = await doUpload(app, loginCookie, new Date().valueOf(), {
        books: {
          updates: [
            {
              id: 1,
              publisher: 1,
            },
          ],
        },
        publisher: {
          inserts: [
            {
              id: 1,
              name: "my_agi",
            },
          ],
        },
      });
      expect(resp.status).toBe(200);
      const { syncDir } = resp._body;
      const translatedIds = await getResult(app, loginCookie, syncDir);
      await cleanSyncDir(app, loginCookie, syncDir);
      expect(translatedIds).toBeDefined();
      expect(translatedIds).toEqual({
        publisher: {
          1: maxPublId + 1,
        },
      });
      // TODO check update conflics on book
    });

    it("deletes normal", async () => {
      const books = Table.findOne({ name: "books" });
      const syncTimeStamp = new Date();
      const oldRows = await books.getRows();
      const newId = await books.insertRow(
        { author: "agi", pages: 22 },
        null,
        null,
        false,
        syncTimeStamp
      );
      const newRows = await books.getRows();
      expect(newRows.length).toBe(oldRows.length + 1);
      const app = await getApp({ disableCsrf: true });
      const loginCookie = await getAdminLoginCookie();
      const resp = await doUpload(app, loginCookie, new Date().valueOf(), {
        books: {
          deletes: [
            {
              id: newId,
              last_modified: syncTimeStamp.valueOf(),
            },
          ],
        },
      });
      expect(resp.status).toBe(200);
      const { syncDir } = resp._body;
      const translatedIds = await getResult(app, loginCookie, syncDir);
      await cleanSyncDir(app, loginCookie, syncDir);
      expect(translatedIds).toBeDefined();
      const afterDelete = await books.getRows();
      expect(afterDelete.length).toBe(oldRows.length);
    });

    // skip delete because of larger last_modified on the server side
    it("deletes with conflicts", async () => {
      const books = Table.findOne({ name: "books" });
      const syncTimeStamp = new Date();
      const oldRows = await books.getRows();
      const newId = await books.insertRow(
        { author: "my_agi", pages: 22 },
        null,
        null,
        false,
        syncTimeStamp
      );
      await books.updateRow(
        { pages: 11 },
        newId,
        undefined,
        undefined,
        undefined,
        undefined,
        new Date(syncTimeStamp.valueOf() + 1)
      );
      const newRows = await books.getRows();
      expect(newRows.length).toBe(oldRows.length + 1);
      const app = await getApp({ disableCsrf: true });
      const loginCookie = await getAdminLoginCookie();
      const resp = await doUpload(app, loginCookie, new Date().valueOf(), {
        books: {
          deletes: [
            {
              id: newId,
              last_modified: syncTimeStamp.valueOf(),
            },
          ],
        },
      });
      expect(resp.status).toBe(200);
      const { syncDir } = resp._body;
      const translatedIds = await getResult(app, loginCookie, syncDir);
      await cleanSyncDir(app, loginCookie, syncDir);
      expect(translatedIds).toBeDefined();
      const afterDelete = await books.getRows();
      expect(afterDelete.length).toBe(newRows.length);
    });

    it("insert not authorized", async () => {
      const books = Table.findOne({ name: "books" });
      books.min_role_write = 1;
      await books.update(books);
      const app = await getApp({ disableCsrf: true });
      const loginCookie = await getUserLoginCookie();
      const resp = await doUpload(app, loginCookie, new Date().valueOf(), {
        books: {
          inserts: [
            {
              id: 1,
              author: "app agi",
              pages: 1,
              publisher: 1,
            },
          ],
        },
        publisher: {
          inserts: [
            {
              id: 1,
              name: "agi",
            },
          ],
        },
      });
      expect(resp.status).toBe(200);
      const { syncDir } = resp._body;
      const error = await getResult(app, loginCookie, syncDir);
      await cleanSyncDir(app, loginCookie, syncDir);
      expect(error).toBeDefined();
      expect(error).toEqual({ message: "Unable to insert into books" });
      books.min_role_write = 100;
      await books.update(books);
    });

    it("update not authorized", async () => {
      const books = Table.findOne({ name: "books" });
      books.min_role_write = 1;
      await books.update(books);

      const app = await getApp({ disableCsrf: true });
      const loginCookie = await getUserLoginCookie();
      const resp = await doUpload(app, loginCookie, new Date().valueOf(), {
        books: {
          updates: [
            {
              id: 1,
              pages: 1,
            },
          ],
        },
      });
      expect(resp.status).toBe(200);
      const { syncDir } = resp._body;
      const error = await getResult(app, loginCookie, syncDir);
      await cleanSyncDir(app, loginCookie, syncDir);
      expect(error).toBeDefined();
      expect(error).toEqual({
        message: "Unable to update books: Not authorized",
      });
      books.min_role_write = 100;
      await books.update(books);
    });

    it("delete not authorized", async () => {
      const syncTimeStamp = new Date();
      const books = Table.findOne({ name: "books" });
      books.min_role_write = 1;
      await books.update(books);

      const app = await getApp({ disableCsrf: true });
      const loginCookie = await getUserLoginCookie();
      const resp = await doUpload(app, loginCookie, syncTimeStamp.valueOf(), {
        books: {
          deletes: [
            {
              id: 1,
              last_modified: syncTimeStamp.valueOf() + 1,
            },
          ],
        },
      });
      expect(resp.status).toBe(200);
      const { syncDir } = resp._body;
      const error = await getResult(app, loginCookie, syncDir);
      await cleanSyncDir(app, loginCookie, syncDir);
      expect(error).toBeDefined();
      expect(error).toEqual({
        message: "Unable to delete in 'books': Some rows were not deleted",
      });
      books.min_role_write = 100;
      await books.update(books);
    });
  } else
    it("only pq support", () => {
      expect(true).toBe(true);
    });
});
