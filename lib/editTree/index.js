import EditTree from "./src/index.vue";
EditTree.install = (Vue) => {
  Vue.component(EditTree.name, EditTree);
};

export default EditTree;
