const tableData = [
  { id: 1, type: "q1", month: "January", sales: 50000.0, topSalesPerson: "Angela" },
  { id: 2, type: "q1", month: "February", sales: 10000.0, topSalesPerson: "Roberto" },
  { id: 3, type: "q1", month: "March", sales: 85000.0, topSalesPerson: "Maria" },
  { id: 4, type: "q2", month: "April", sales: 56000.0, topSalesPerson: "Stacy" },
  { id: 5, type: "q2", month: "May", sales: 68000.0, topSalesPerson: "William" },
  { id: 6, type: "q2", month: "June", sales: 32000.0, topSalesPerson: "Darrel" },
  { id: 7, type: "q3", month: "July", sales: 21000.0, topSalesPerson: "Angela" },
  { id: 8, type: "q3", month: "August", sales: 18000.0, topSalesPerson: "Angela" },
  { id: 9, type: "q3", month: "September", sales: 118000.0, topSalesPerson: "Maria" },
  { id: 10, type: "q4", month: "October", sales: 52000.0, topSalesPerson: "Stacy" },
  { id: 11, type: "q4", month: "November", sales: 87000.0, topSalesPerson: "Angela" },
  { id: 12, type: "q4", month: "December", sales: 121000.0, topSalesPerson: "William" },
];

const types = ["q1", "q2", "q3", "q4"];

const options = {
  filter: [],
  sortBy: null,
};

const format_currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format;

function initializeTable(tableId, data) {
  const keys = [];

  const head_tr_ele = document.querySelector(`#${tableId} > thead > tr`);
  let tbody_ele = document.querySelector(`#${tableId} > tbody`);

  if (!head_tr_ele || !tbody_ele) throw new Error(`Cloud not find table '${tableId}'`);

  if (tbody_ele.children && tbody_ele.children.length) {
    tbody_ele.remove();
    tbody_ele = document.createElement("tbody");
    document.getElementById(tableId).appendChild(tbody_ele);
  }

  if (!head_tr_ele.children || !head_tr_ele.children.length || !data || !data.length) return;

  for (let i = 0; i < head_tr_ele.children.length; i += 1) {
    const element = head_tr_ele.children[i];
    element.removeEventListener("click", onClickTableHeader);

    if (element.attributes["data-value"]) {
      let sortable = false;
      if (element.attributes["sortable"]) {
        sortable = true;
        element.addEventListener("click", onClickTableHeader);
      }
      keys.push({ key: element.attributes["data-value"].value, sortable: sortable });
    }
  }

  if (!keys.length) return;

  const clonedData = [...data];
  if (options.sortBy) {
    clonedData.sort(function (item1, item2) {
      const a = item1[options.sortBy.key];
      const b = item2[options.sortBy.key];

      if(typeof a === 'number') {
        if(options.sortBy.direction === 'asc') {
          return a - b;
        }
        return b - a;
      } else if (typeof a === 'string') {
        // string
        if(options.sortBy.direction === 'asc') {
          return  a.localeCompare(b);
        }
        return b.localeCompare(a);
      }
    });
  }

  for (let i = 0; i < clonedData.length; i += 1) {
    if (options.filter.includes(tableData[i].type)) {
      const tr_ele = document.createElement("tr");
      tr_ele.setAttribute("data-id", clonedData[i].id);

      for (let j = 0; j < keys.length; j += 1) {
        const td_ele = document.createElement("td");
        let value = clonedData[i][keys[j].key];
        if(keys[j].key === "sales") {
          value = format_currency(value);
        }
        td_ele.innerHTML = value;
        tr_ele.appendChild(td_ele);
      }

      tbody_ele.appendChild(tr_ele);
    }
  }
}

function initialize() {
  options.filter = types;
  options.sortBy = null;

  initializeTable("data-table", tableData);

  for (let i = 0; i < options.filter.length; i += 1) {
    const element = document.getElementById(options.filter[i]);
    element.checked = true;
    element.addEventListener("change", onChangeFilter);
  }
}

function onChangeFilter() {
  options.filter = [];

  filteredData = [];

  for (let i = 0; i < types.length; i += 1) {
    const element = document.getElementById(types[i]);
    if (element.checked) {
      options.filter.push(types[i]);
    }
  }

  initializeTable("data-table", tableData);
}

function onClickTableHeader(event) {
  const value = event.target.attributes["data-value"].value;
  if (options.sortBy && options.sortBy.key === value) {
    if (options.sortBy.direction === "asc") {
      options.sortBy.direction = "desc";
    } else {
      options.sortBy = null;
    }
  } else {
    options.sortBy = { key: value, direction: "asc" };
  }

  initializeTable("data-table", tableData);
}

(function () {
  initialize();
})();
