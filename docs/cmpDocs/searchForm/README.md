# SearchForm 检索表单
### 
特性：能根据当前盒子宽度和表单项的宽度来计算，判断是否要将表单折叠
### 使用场景
在表单页输入检索条件以检索数据

### live demo
<div>
    <search-form>
        <search-form-item label="姓名" type="input" dataIndex="name"/>
        <search-form-item label="性别" type="select" dataIndex="gender" :selections="[{value:1,name:'male'}, {value:2,name:'female'}]"/>
        <search-form-item label="姓名" type="input" dataIndex="name1"/>
        <search-form-item label="性别" type="select" dataIndex="gender1" :selections="[{value:1,name:'male'}, {value:2,name:'female'}]"/>
        <search-form-item :width="500" label="性别" type="select" dataIndex="gender2" :selections="[{value:1,name:'male'}, {value:2,name:'female'}]"/>
    </search-form>
</div>



::: details 点击查看代码
```vue
<search-form>
    <search-form-item label="姓名" type="input" dataIndex="name"/>
    <search-form-item label="性别" type="select" dataIndex="gender" :selections="[{value:1,name:'male'}, {value:2,name:'female'}]"/>
    <search-form-item label="姓名" type="input" dataIndex="name"/>
    <search-form-item label="性别" type="select" dataIndex="gender" :selections="[{value:1,name:'male'}, {value:2,name:'female'}]"/>
    <search-form-item :width="500" label="性别" type="select" dataIndex="gender" :selections="[{value:1,name:'male'}, {value:2,name:'female'}]"/>
</search-form>
```
:::


### 引用

```js
import SearchForm, { SearchFormItem } from 'web-component/dist/searchForm'

export default {
	components: {
        SearchForm,
        SearchFormItem
	}
}
```


### 基础用法
```vue
<search-form @reset="onReset" @submit="onSearch">
    <search-form-item
        label="类代码"
        type="input"
        placeholder="请输入"
        dataIndex="typeCode"
    ></search-form-item>
</search-form>
```

### SearchForm 组件事件

| name    | type                                          | desc                                   |
| ------- | --------------------------------------------- | -------------------------------------- |
| @submit | Function (params: {/** 抛出的表单对象 */}) {} | 当组件内的控件被用户输入时会触发       |
| @reset  | Function () {}                                | 当点击"重置"时，会重置组件内所有的控件 |

#### SearchForm 组件方法

*通过`$ref.{searchForm}`来调用*

| name      | type                              | desc                                                  |
| --------- | --------------------------------- | ----------------------------------------------------- |
| getValues | Function (): {/** 表单对象 */} {} | 通过`$refs 来获取引用，调用实例的方法，来获取表单对象 |



### SearchFormItem  组件入参

| name       | type                                                               | required | desc                                                                                                                                       |
| ---------- | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| dataIndex  | string                                                             | t        | key                                                                                                                                        |
| width      | number                                                             | f        | 列的宽度，默认是216                                                                                                                        |
| label      | string                                                             | t        |                                                                                                                                            |
| selections | any[]                                                              | f        | 当type为"select"或者"selectTree"时需要                                                                                                     |
| type       | "input" \| "select" \| "textarea" \| "selectTree" \| "rangePicker" | t        |                                                                                                                                            |
| allowClear | boolean                                                            | f        | 是否可以快捷清除                                                                                                                           |
| colon      | boolean                                                            | f        |                                                                                                                                            |
| delay      | number                                                             | f        | 设定表单组件，在控件输入的过程种，发布输入事件最高的频率是delay ms最多触发一次                                                             |
| 其他参数   | any                                                                | f        | 采用了透传的方式，所有参数请按照antd文档给出的示范去传，包括事件的监听，例如，当type为selectTree时，`<search-form-item :tree-data="[]" />` |



