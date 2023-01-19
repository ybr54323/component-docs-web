import SearchForm from "./src/index.vue";
import SearchFormItem from "./src/components/searchFormItem.vue";

SearchForm.install = (Vue) => {
    Vue.component(SearchForm.name, SearchForm);
};
SearchFormItem.install = Vue => {
    Vue.component(SearchFormItem.name, SearchFormItem)
}

export default SearchForm;

export { SearchFormItem };
