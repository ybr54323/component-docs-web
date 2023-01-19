import EnhanceTable from "./src/index.vue";
EnhanceTable.install = (Vue) => {
  Vue.component(EnhanceTable.name, EnhanceTable);
};

export default EnhanceTable;
