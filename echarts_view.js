const Workflow = require("@saltcorn/data/models/workflow");
const Form = require("@saltcorn/data/models/form");
const FieldRepeat = require("@saltcorn/data/models/fieldrepeat");
const Table = require("@saltcorn/data/models/table");
const { div, script, domReady } = require("@saltcorn/markup/tags");
const {
  readState,
  stateFieldsToWhere,
} = require("@saltcorn/data/plugin-helper");

const multiAblePlots = ["line", "area", "scatter", "bar"];

const configuration_workflow = () =>
  new Workflow({
    steps: [
      {
        name: "Chart",
        form: async (context) => {
          const table = await Table.findOne({ id: context.table_id });
          const fields = await table.getFields();
          const fieldOptions = fields.map((f) => f.name);
          const group_fields = fields
            .filter(
              (f) => ["Integer", "String"].includes(f.type.name) || f.is_fkey
            )
            .map((f) => f.name);
          return new Form({
            fields: [
              {
                name: "plot_type",
                label: "Plot type",
                type: "String",
                required: true,
                attributes: {
                  options: [
                    { label: "Line chart", name: "line" },
                    { label: "Area chart", name: "area" },
                    { label: "Scatter chart", name: "scatter" },
                    { label: "Bar chart", name: "bar" },
                    { label: "Pie chart", name: "pie" },
                    { label: "Histogram", name: "histogram" },
                  ],
                },
              },
              {
                name: "plot_series",
                label: "Plot series",
                type: "String",
                required: true,
                showIf: { plot_type: multiAblePlots },
                attributes: {
                  options: [
                    { label: "Single", name: "single" },
                    { label: "Multiple", name: "multiple" },
                    { label: "Group by Field", name: "group_by_field" },
                  ],
                },
              },
              {
                name: "x_field",
                label: "X field",
                type: "String",
                required: true,
                showIf: { plot_type: ["line", "area", "scatter"] },
                attributes: { options: fieldOptions },
              },
              {
                name: "y_field",
                label: "Y field",
                type: "String",
                required: true,
                showIf: { plot_series: ["single", "group_by_field"] },
                attributes: { options: fieldOptions },
              },
              {
                name: "histogram_field",
                label: "Data field",
                type: "String",
                required: true,
                showIf: { plot_type: "histogram" },
                attributes: { options: fieldOptions },
              },
              new FieldRepeat({
                name: "series",
                label: "Series",
                showIf: {
                  plot_series: "multiple",
                  plot_type: multiAblePlots,
                },
                fields: [
                  {
                    name: "y_field",
                    label: "Y field",
                    type: "String",
                    required: true,
                    attributes: { options: fieldOptions },
                  },
                ],
              }),
              {
                name: "group_field",
                label: "Grouping field",
                type: "String",
                required: true,
                attributes: {
                  options: group_fields,
                },
                showIf: {
                  plot_series: "group_by_field",
                  plot_type: multiAblePlots,
                },
              },
              {
                name: "bar_stack",
                label: "Stack series",
                type: "Bool",
                showIf: {
                  plot_type: "bar",
                  plot_series: ["multiple", "group_by_field"],
                },
              },
              {
                name: "bar_orientation",
                label: "Orientation",
                type: "String",
                showIf: { plot_type: "bar" },
                attributes: {
                  options: [
                    { label: "Vertical", name: "vertical" },
                    { label: "Horizontal", name: "horizontal" },
                  ],
                },
              },
              {
                name: "smooth",
                label: "Smooth line",
                type: "Bool",
                showIf: { plot_type: ["line", "area"] },
              },
              {
                name: "pie_name_field",
                label: "Name field",
                type: "String",
                required: true,
                showIf: { plot_type: "pie" },
                attributes: { options: fieldOptions },
              },
              {
                name: "pie_value_field",
                label: "Value field",
                type: "String",
                required: true,
                showIf: { plot_type: "pie" },
                attributes: { options: fieldOptions },
              },
              {
                name: "pie_donut",
                label: "Donut",
                type: "Bool",
                showIf: { plot_type: "pie" },
              },
            ],
          });
        },
      },
    ],
  });

const get_state_fields = async (table_id, viewname, config) => {
  return [];
};

const buildChartScript = (
  data,
  { plot_type, plot_series, smooth, bar_stack, bar_orientation, pie_donut }
) => {
  switch (plot_type) {
    case "line":
      if (plot_series === "multiple" || plot_series === "group_by_field") {
        const seriesArr = data.map((s) => ({
          type: "line",
          name: s.name,
          smooth: !!smooth,
          data: s.points,
        }));
        return `
          var option = {
            xAxis: { type: 'value' },
            yAxis: { type: 'value' },
            legend: {},
            series: ${JSON.stringify(seriesArr)}
          };
          myChart.setOption(option);`;
      }
      return `
        var option = {
          xAxis: { type: 'value' },
          yAxis: { type: 'value' },
          series: [{ type: 'line', smooth: ${!!smooth}, data: ${JSON.stringify(
        data
      )} }]
        };
        myChart.setOption(option);`;

    case "area":
      if (plot_series === "multiple" || plot_series === "group_by_field") {
        const seriesArr = data.map((s) => ({
          type: "line",
          name: s.name,
          smooth: !!smooth,
          areaStyle: {},
          data: s.points,
        }));
        return `
          var option = {
            xAxis: { type: 'value' },
            yAxis: { type: 'value' },
            legend: {},
            series: ${JSON.stringify(seriesArr)}
          };
          myChart.setOption(option);`;
      }
      return `
        var option = {
          xAxis: { type: 'value' },
          yAxis: { type: 'value' },
          series: [{
            type: 'line',
            smooth: ${!!smooth},
            areaStyle: {},
            data: ${JSON.stringify(data)}
          }]
        };
        myChart.setOption(option);`;

    case "bar": {
      const { categories, series: barSeries } = data;
      const horizontal = bar_orientation === "horizontal";
      const seriesArr = JSON.stringify(
        barSeries.map((s) => ({
          type: "bar",
          name: s.name,
          stack: bar_stack ? "total" : undefined,
          data: s.values,
        }))
      );
      const categoryAxis = JSON.stringify({
        type: "category",
        data: categories,
      });
      const valueAxis = JSON.stringify({ type: "value" });
      return `
        var option = {
          ${
            horizontal
              ? `xAxis: ${valueAxis}, yAxis: ${categoryAxis}`
              : `xAxis: ${categoryAxis}, yAxis: ${valueAxis}`
          },
          legend: {},
          series: ${seriesArr}
        };
        myChart.setOption(option);`;
    }

    case "pie": {
      const pieData = JSON.stringify(data);
      const radius = pie_donut ? "['40%', '70%']" : "'50%'";
      return `
        var option = {
          series: [{
            type: 'pie',
            radius: ${radius},
            data: ${pieData}
          }]
        };
        myChart.setOption(option);`;
    }

    case "scatter":
      if (plot_series === "multiple" || plot_series === "group_by_field") {
        const seriesArr = data.map((s) => ({
          type: "scatter",
          name: s.name,
          data: s.points,
        }));
        return `
          var option = {
            xAxis: { type: 'value' },
            yAxis: { type: 'value' },
            legend: {},
            series: ${JSON.stringify(seriesArr)}
          };
          myChart.setOption(option);`;
      }
      return `
        var option = {
          xAxis: { type: 'value' },
          yAxis: { type: 'value' },
          series: [{ type: 'scatter', data: ${JSON.stringify(data)} }]
        };
        myChart.setOption(option);`;

    case "histogram": {
      return `
        echarts.registerTransform(ecStat.transform.histogram);
        var option = {
          dataset: [
            { source: ${JSON.stringify(data)} },
            { transform: { type: 'ecStat:histogram', config: {} } }
          ],
          tooltip: {},
          xAxis: [{ scale: true, boundaryGap: ['5%', '5%'] }],
          yAxis: [{}],
          series: [{
            name: 'histogram',
            type: 'bar',
            barWidth: '99.3%',
            encode: { x: 0, y: 1, itemName: 4 },
            datasetIndex: 1
          }]
        };
        myChart.setOption(option);`;
    }

    default:
      return "";
  }
};

const prepChartData = (
  rows,
  {
    plot_type,
    plot_series,
    x_field,
    y_field,
    series,
    pie_name_field,
    pie_value_field,
    group_field,
    histogram_field,
  }
) => {
  if (plot_type === "histogram") {
    return rows
      .map((r) => r[histogram_field])
      .filter((v) => v !== null && v !== undefined)
      .map((v) => [v]);
  }
  if (plot_type === "bar") {
    const allCategories = new Set();
    let computed;
    if (plot_series === "group_by_field" && group_field) {
      const groups = {};
      rows.forEach((r) => {
        const grp = r[group_field] === null ? "null" : String(r[group_field]);
        const val = String(r[y_field]);
        if (!groups[grp]) groups[grp] = {};
        groups[grp][val] = (groups[grp][val] || 0) + 1;
        allCategories.add(val);
      });
      computed = Object.entries(groups).map(([name, counts]) => ({
        name,
        counts,
      }));
    } else {
      const fieldList =
        plot_series === "multiple" && series
          ? series.map((s) => s.y_field)
          : [y_field];
      computed = fieldList.map((fieldName) => {
        const counts = {};
        rows.forEach((r) => {
          const val = String(r[fieldName]);
          counts[val] = (counts[val] || 0) + 1;
          allCategories.add(val);
        });
        return { name: fieldName, counts };
      });
    }
    const categories = [...allCategories];
    return {
      categories,
      series: computed.map((s) => ({
        name: s.name,
        values: categories.map((cat) => s.counts[cat] || 0),
      })),
    };
  }
  if (plot_type === "pie") {
    return rows.map((r) => ({
      name: r[pie_name_field],
      value: r[pie_value_field],
    }));
  }
  if (plot_series === "group_by_field" && group_field) {
    const diffvals = new Set(rows.map((r) => r[group_field]));
    return [...diffvals].map((val) => ({
      name: val === null ? "null" : String(val),
      points: rows
        .filter((r) => r[group_field] === val)
        .map((r) => [r[x_field], r[y_field]]),
    }));
  }
  if (plot_series === "multiple" && series) {
    return series.map((s) => ({
      name: s.y_field,
      points: rows.map((r) => [r[x_field], r[s.y_field]]),
    }));
  }
  return rows.map((r) => [r[x_field], r[y_field]]);
};

const loadRows = async (
  table_id,
  {
    plot_type,
    plot_series,
    x_field,
    y_field,
    series,
    pie_name_field,
    pie_value_field,
    group_field,
    histogram_field,
  },
  state
) => {
  const table = await Table.findOne({ id: table_id });
  const fields = await table.getFields();
  readState(state, fields);
  const where = await stateFieldsToWhere({ fields, state });
  const joinFields = {};
  const qfields = [];

  const gfield = fields.find((f) => f.name === group_field);
  let group_by_joinfield = false;
  if (plot_type === "histogram") {
    qfields.push(histogram_field);
  } else if (
    plot_series === "group_by_field" &&
    group_field &&
    multiAblePlots.indexOf(plot_type) >= 0
  ) {
    if (gfield?.is_fkey && gfield.attributes.summary_field) {
      group_by_joinfield = true;
      joinFields.__groupjoin = {
        ref: group_field,
        target: gfield.attributes.summary_field,
      };
    }
    if (plot_type !== "bar") qfields.push(x_field);
    qfields.push(y_field);
    if (!group_by_joinfield) qfields.push(group_field);
  } else if (
    plot_series === "multiple" &&
    series &&
    multiAblePlots.indexOf(plot_type) >= 0
  ) {
    if (plot_type !== "bar") qfields.push(x_field);
    qfields.push(x_field, ...series.map((s) => s.y_field));
  } else if (plot_type === "pie") {
    qfields.push(pie_name_field, pie_value_field);
  } else {
    qfields.push(x_field, y_field);
  }

  const orderBy = ["line", "area"].includes(plot_type) ? x_field : undefined;

  const rows = await table.getJoinedRows({
    where,
    joinFields,
    fields: qfields,
    ...(orderBy && { orderBy }),
  });
  return { rows, group_by_joinfield };
};

const run = async (table_id, viewname, config, state, { req }, queriesObj) => {
  const { rows, group_by_joinfield } = await loadRows(table_id, config, state);
  const effectiveConfig = group_by_joinfield
    ? { ...config, group_field: "__groupjoin" }
    : config;
  const data = prepChartData(rows, effectiveConfig);
  const chartScript = buildChartScript(data, config);
  if (!chartScript) return "";

  const divid = `echarts_${viewname}`;
  return (
    div({ id: divid, style: "width: 600px; height: 400px;" }) +
    script(
      domReady(`
        var chartDom = document.getElementById('${divid}');
        var myChart = echarts.init(chartDom);
        ${chartScript}
      `)
    )
  );
};

module.exports = {
  name: "Chart",
  display_state_form: false,
  get_state_fields,
  configuration_workflow,
  run,
};
