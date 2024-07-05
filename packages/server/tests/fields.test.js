const request = require("supertest");
const getApp = require("../app");
const Field = require("@saltcorn/data/models/field");
const Table = require("@saltcorn/data/models/table");

const {
  getStaffLoginCookie,
  getAdminLoginCookie,
  itShouldRedirectUnauthToLogin,
  toInclude,
  toBeTrue,
  toNotInclude,
  toRedirect,
  resetToFixtures,
  respondJsonWith,
} = require("../auth/testhelp");
const db = require("@saltcorn/data/db");

afterAll(db.close);

beforeAll(async () => {
  await resetToFixtures();
});

describe("Field Endpoints", () => {
  itShouldRedirectUnauthToLogin("/field/2");

  it("should show existing", async () => {
    const loginCookie = await getAdminLoginCookie();
    const app = await getApp({ disableCsrf: true });
    await request(app)
      .get("/field/2")
      .set("Cookie", loginCookie)
      .expect(toInclude("Label"));
  });

  it("should new form", async () => {
    const loginCookie = await getAdminLoginCookie();
    const app = await getApp({ disableCsrf: true });
    await request(app)
      .get("/field/new/2")
      .set("Cookie", loginCookie)
      .expect(toInclude("Label"));
  });

  it("should post new int field", async () => {
    const loginCookie = await getAdminLoginCookie();
    const table = Table.findOne({ name: "books" });

    const ctx = encodeURIComponent(JSON.stringify({ table_id: table.id }));
    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post("/field/")
      .send("stepName=Basic properties")
      .send("name=AgeRating")
      .send("label=AgeRating")
      .send("type=Integer")
      .send("contextEnc=" + ctx)
      .set("Cookie", loginCookie)
      .expect(200);
  });

  it("should post new int field with attributes", async () => {
    const loginCookie = await getAdminLoginCookie();
    const table = Table.findOne({ name: "books" });

    const ctx = encodeURIComponent(
      JSON.stringify({
        table_id: table.id,
        name: "AgeRating",
        label: "AgeRating",
        type: "Integer",
        required: false,
      })
    );

    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post("/field/")
      .send("stepName=Attributes")
      .send("contextEnc=" + ctx)
      .send("min=0")
      .send("max=410")
      .set("Cookie", loginCookie)
      .expect(toRedirect("/table/2"));
  });
  it("should delete new field", async () => {
    const loginCookie = await getAdminLoginCookie();
    const fld = await Field.findOne({ name: "AgeRating" });
    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post(`/field/delete/${fld.id}`)
      .set("Cookie", loginCookie)
      .expect(toRedirect("/table/2"));
  });
  it("should post new string field", async () => {
    const loginCookie = await getAdminLoginCookie();
    const ctx = encodeURIComponent(JSON.stringify({ table_id: 2 }));

    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post("/field/")
      .send("stepName=Basic properties")
      .send("name=Editor")
      .send("label=Editor")
      .send("type=String")
      .send("contextEnc=" + ctx)
      .set("Cookie", loginCookie)
      .expect(toInclude("options"));
  });

  it("should post new fkey field", async () => {
    const loginCookie = await getAdminLoginCookie();
    const ctx = encodeURIComponent(JSON.stringify({ table_id: 3 }));
    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post("/field/")
      .send("stepName=Basic properties")
      .send("name=wrote")
      .send("label=wrote")
      .send("type=Key+to+books")
      .send("contextEnc=" + ctx)
      .set("Cookie", loginCookie)
      .expect(toInclude("pages"));
  });

  it("should post new nonrequired fkey field with summary", async () => {
    const loginCookie = await getAdminLoginCookie();
    const ctx = encodeURIComponent(
      JSON.stringify({
        table_id: 2,
        name: "cowrote",
        label: "cowrote",
        type: "Key to books",
        required: false,
      })
    );

    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post("/field/")
      .send("stepName=Summary")
      .send("contextEnc=" + ctx)
      .send("summary_field=pages")
      .send("on_delete=Fail")
      .set("Cookie", loginCookie)
      .expect(toRedirect("/table/2"));
  });

  it("should post new required fkey field with summary", async () => {
    const loginCookie = await getAdminLoginCookie();
    const ctx = encodeURIComponent(
      JSON.stringify({
        table_id: 2,
        name: "wrote",
        label: "Wrote",
        type: "Key to books",
        summary_field: "pages",
        required: true,
      })
    );

    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post("/field/")
      .send("stepName=Default")
      .send("contextEnc=" + ctx)
      .send("summary_field=pages")
      .send("default=1")
      .set("Cookie", loginCookie)
      .expect(toRedirect("/table/2"));
  });

  it("should post new required string field", async () => {
    const loginCookie = await getAdminLoginCookie();
    const ctx = encodeURIComponent(
      JSON.stringify({
        table_id: 2,
        name: "zowrote",
        label: "ZoWrote",
        type: "String",
        required: true,
      })
    );

    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post("/field/")
      .send("stepName=Default")
      .send("contextEnc=" + ctx)
      .send("default=foo")
      .set("Cookie", loginCookie)
      .expect(toRedirect("/table/2"));
  });
  it("should post new required int field", async () => {
    const loginCookie = await getAdminLoginCookie();
    const ctx = encodeURIComponent(
      JSON.stringify({
        table_id: 2,
        name: "weight",
        label: "weight",
        type: "Integer",
        required: true,
      })
    );

    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post("/field/")
      .send("stepName=Default")
      .send("contextEnc=" + ctx)
      .send("default=56")
      .set("Cookie", loginCookie)
      .expect(toRedirect("/table/2"));
  });

  it("should show field in table", async () => {
    const loginCookie = await getAdminLoginCookie();

    const app = await getApp({ disableCsrf: true });
    await request(app)
      .get(`/table/2`)
      .set("Cookie", loginCookie)
      .expect(toInclude("wrote"))
      .expect(toInclude("ZoWrote"))
      .expect(toInclude("weight"))
      .expect(toNotInclude("[object"));
  });

  it("should post new calculated int field", async () => {
    const loginCookie = await getAdminLoginCookie();
    const table = Table.findOne({ name: "books" });

    const ctx = encodeURIComponent(JSON.stringify({ table_id: table.id }));
    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post("/field/")
      .send("stepName=Basic properties")
      .send("label=PagesPlus10")
      .send("type=Integer")
      .send("calculated=on")
      .send("contextEnc=" + ctx)
      .set("Cookie", loginCookie)
      .expect(200)
      .expect(toInclude("Examples:"));
    const ctx1 = encodeURIComponent(
      JSON.stringify({
        table_id: table.id,
        type: "Integer",
        label: "PagesPlus10",
        calculated: true,
      })
    );

    await request(app)
      .post("/field/")
      .send("stepName=Expression")
      .send("expression=" + encodeURIComponent("pages+10"))
      .send("contextEnc=" + ctx1)
      .set("Cookie", loginCookie)
      .expect(toRedirect("/table/2"));
    const table1 = Table.findOne({ name: "books" });

    const row = await table1.getRow({ id: 1 });
    expect(row.pagesplus10).toBe(977);
  });
  it("should post new calculated string field", async () => {
    const loginCookie = await getAdminLoginCookie();
    const table = Table.findOne({ name: "books" });

    const ctx = encodeURIComponent(JSON.stringify({ table_id: table.id }));
    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post("/field/")
      .send("stepName=Basic properties")
      .send("name=AgeRating")
      .send("label=AgeRating")
      .send("type=String")
      .send("calculated=on")
      .send("contextEnc=" + ctx)
      .set("Cookie", loginCookie)
      .expect(200)
      .expect(toInclude("Examples:"));
  });
  it("should post new calculated float field", async () => {
    const loginCookie = await getAdminLoginCookie();
    const table = Table.findOne({ name: "books" });

    const ctx = encodeURIComponent(JSON.stringify({ table_id: table.id }));
    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post("/field/")
      .send("stepName=Basic properties")
      .send("name=AgeRating")
      .send("label=AgeRating")
      .send("type=Float")
      .send("calculated=on")
      .send("contextEnc=" + ctx)
      .set("Cookie", loginCookie)
      .expect(200)
      .expect(toInclude("Examples:"));
  });
  it("should post new calculated boolean field", async () => {
    const loginCookie = await getAdminLoginCookie();
    const table = Table.findOne({ name: "books" });

    const ctx = encodeURIComponent(JSON.stringify({ table_id: table.id }));
    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post("/field/")
      .send("stepName=Basic properties")
      .send("name=AgeRating")
      .send("label=AgeRating")
      .send("type=Bool")
      .send("calculated=on")
      .send("contextEnc=" + ctx)
      .set("Cookie", loginCookie)
      .expect(200)
      .expect(toInclude("Examples:"));
  });
  it("should test expression", async () => {
    const loginCookie = await getAdminLoginCookie();
    const table = Table.findOne({ name: "books" });

    const ctx = encodeURIComponent(JSON.stringify({ table_id: table.id }));
    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post("/field/test-formula")
      .send({
        formula: "1+1",
        tablename: "books",
        stored: false,
      })
      .set("Cookie", loginCookie)
      .expect(toInclude(" is: <pre>2</pre>"));
  });
  it("should test stored expression", async () => {
    const loginCookie = await getAdminLoginCookie();
    const table = Table.findOne({ name: "books" });

    const ctx = encodeURIComponent(JSON.stringify({ table_id: table.id }));
    const app = await getApp({ disableCsrf: true });
    await request(app)
      .post("/field/test-formula")
      .send({
        formula: "1+1",
        tablename: "books",
        stored: true,
      })
      .set("Cookie", loginCookie)
      .expect(toInclude(" is: <pre>2</pre>"));
  });
  it("should show calculated", async () => {
    const loginCookie = await getAdminLoginCookie();
    const table = Table.findOne({ name: "books" });
    await Field.create({
      table,
      label: "pagesp1",
      type: "Integer",
      calculated: true,
      expression: "pages+1",
    });
    const app = await getApp({ disableCsrf: true });

    await request(app)
      .post("/field/show-calculated/books/pagesp1/show")
      .set("Cookie", loginCookie)
      .send({
        id: 1,
      })
      .expect(toBeTrue((r) => +r.text > 500 && +r.text < 1500));
  });
  it("should show calculated field with single joinfield", async () => {
    const loginCookie = await getAdminLoginCookie();
    const table = Table.findOne({ name: "patients" });
    await Field.create({
      table,
      label: "pagesp1",
      type: "Integer",
      calculated: true,
      stored: true,
      expression: "favbook.pages+1",
    });
    const app = await getApp({ disableCsrf: true });

    await request(app)
      .post("/field/show-calculated/patients/pagesp1/show")
      .set("Cookie", loginCookie)
      .send({
        id: 1,
      })
      .expect(toBeTrue((r) => +r.text > 2));
  });
  it("should show calculated field with two single joinfields", async () => {
    const loginCookie = await getAdminLoginCookie();
    const table = Table.findOne({ name: "patients" });
    await Field.create({
      table,
      label: "pagesp12",
      type: "Integer",
      calculated: true,
      stored: true,
      expression: "favbook.pages+1+favbook.id",
    });
    const app = await getApp({ disableCsrf: true });

    await request(app)
      .post("/field/show-calculated/patients/pagesp12/show")
      .set("Cookie", loginCookie)
      .send({
        id: 1,
      })
      .expect(toBeTrue((r) => +r.text > 2));
  });
  it("should show calculated field with double joinfield", async () => {
    const loginCookie = await getAdminLoginCookie();
    const table = Table.findOne({ name: "readings" });
    await Field.create({
      table,
      label: "pagesp1",
      type: "Integer",
      calculated: true,
      stored: true,
      expression: "patient_id.favbook.pages+1",
    });
    const app = await getApp({ disableCsrf: true });

    await request(app)
      .post("/field/show-calculated/readings/pagesp1/show")
      .set("Cookie", loginCookie)
      .send({
        id: 1,
      })
      .expect(toBeTrue((r) => +r.text > 2));
  });
  it("should show-calculated on join field value", async () => {
    const loginCookie = await getAdminLoginCookie();

    const app = await getApp({ disableCsrf: true });

    await request(app)
      .post("/field/show-calculated/books/publisher.name/as_text")
      .set("Cookie", loginCookie)
      .send({
        publisher: 1,
      })
      .expect(toBeTrue((r) => r.text === "AK Press"));
  });
  it("should show-calculated on join field value", async () => {
    const loginCookie = await getAdminLoginCookie();

    const app = await getApp({ disableCsrf: true });

    await request(app)
      .post("/field/show-calculated/books/publisher.name/code")
      .set("Cookie", loginCookie)
      .send({
        publisher: 1,
      })
      .expect(toBeTrue((r) => r.text === "<pre><code>AK Press</code></pre>"));
  });
  it("should show-calculated on join field value", async () => {
    const loginCookie = await getAdminLoginCookie();

    const app = await getApp({ disableCsrf: true });

    await request(app)
      .post("/field/show-calculated/books/publisher.name/code")
      .set("Cookie", loginCookie)
      .send({
        publisher: 1,
      })
      .expect(toBeTrue((r) => r.text === "<pre><code>AK Press</code></pre>"));
  });
  it("should show-calculated on join field value", async () => {
    const loginCookie = await getAdminLoginCookie();

    const app = await getApp({ disableCsrf: true });

    await request(app)
      .post(
        "/field/show-calculated/books/publisher.name/show_with_html?code=pub%3A%7B%7Bit.toLowerCase()%7D%7D"
      )
      .set("Cookie", loginCookie)
      .send({
        publisher: 1,
      })
      .expect(toBeTrue((r) => r.text === "pub:ak press"));
  });
  it("should show-calculated on double-join field value", async () => {
    const loginCookie = await getAdminLoginCookie();

    const app = await getApp({ disableCsrf: true });

    await request(app)
      .post("/field/show-calculated/patients/favbook.publisher.name/as_text")
      .set("Cookie", loginCookie)
      .send({
        favbook: 2,
      })
      .expect(toBeTrue((r) => r.text === "AK Press"));
  });
  it("should not show unauth show-calculated on double-join field value", async () => {
    const app = await getApp({ disableCsrf: true });

    await request(app)
      .post("/field/show-calculated/patients/favbook.publisher.name/as_text")

      .send({
        favbook: 2,
      })
      .expect(401);
  });
  it("should preview field", async () => {
    const loginCookie = await getAdminLoginCookie();

    const app = await getApp({ disableCsrf: true });

    await request(app)
      .post("/field/preview/books/author/code")
      .set("Cookie", loginCookie)
      .send({})
      .expect(
        toBeTrue((r) => r.text === "<pre><code>Herman Melville</code></pre>")
      );
  });
  it("should preview joinfield", async () => {
    const loginCookie = await getAdminLoginCookie();

    const app = await getApp({ disableCsrf: true });

    await request(app)
      .post("/field/preview/books/publisher.name/code")
      .set("Cookie", loginCookie)
      .send({})
      .expect(toBeTrue((r) => r.text === "<pre><code>AK Press</code></pre>"));
  });
  it("should preview joinfield with cfg", async () => {
    const loginCookie = await getAdminLoginCookie();

    const app = await getApp({ disableCsrf: true });

    await request(app)
      .post("/field/preview/books/publisher.name/show_with_html")
      .set("Cookie", loginCookie)
      .send({
        configuration: {
          code: "pub:{{it.toLowerCase()}}",
        },
      })
      .expect(toBeTrue((r) => r.text === "pub:ak press"));
  });
});

describe("Fieldview config", () => {
  //itShouldRedirectUnauthToLogin("/field/2");
  it("should return fieldview options", async () => {
    const loginCookie = await getAdminLoginCookie();

    const app = await getApp({ disableCsrf: true });

    await request(app)
      .post("/field/fieldviewcfgform/books")
      .set("Cookie", loginCookie)
      .send({
        type: "Field",
        field_name: "pages",
        fieldview: "progress_bar",
      })
      .expect(toInclude(`<div class="form-group"><div class="form-check">`))
      .expect(
        toInclude(
          `<div><label for="inputpx_height">Height in px</label></div><div><input type="number" class="form-control  item-menu" data-fieldname="px_height" name="px_height" id="inputpx_height" step="1"></div>`
        )
      );
  });
});
