# 表格
### live demo
<ClientOnly>
  <enhance-table-demo></enhance-table-demo>
</ClientOnly>


::: details 点击查看代码
```vue
<template>
  <div>
    <enhance-table
      :row-selection="{
        selectedRowKeys,
        onChange,
      }"
      title="表格"
      :columns="columns"
      ref="table"
      @add="add"
    >
      <div slot="name" slot-scope="{ text }">{{ text }}</div>
      <div slot="operation" slot-scope="{ record }">{{ record }}</div>
    </enhance-table>
  </div>
</template>

<script>
export default {
  name: "EnhanceTableDemo",
  data() {
    return {
      selectedRowKeys: [],
      columns: [
        {
          title: "name",
          dataIndex: "name",
          width: "30%",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "age",
          dataIndex: "age",
        },
        {
          title: "address",
          dataIndex: "address",
        },
        {
          title: "operation",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.table.fetch(({ pageParams, dataSource }) => {
        dataSource.value = [
          {
            key: "0",
            name: "Edward King 0",
            age: "32",
            address: "London, Park Lane no. 0",
          },
          {
            key: "1",
            name: "Edward King 1",
            age: "32",
            address: "London, Park Lane no. 1",
          },
        ];
      });
    });
  },
  methods: {
    onChange(keys) {
      this.selectedRowKeys = keys;
    },
    add() {

    }
  },
};
</script>
```
:::

### 特性

- [x] 列排序器
- [x] 翻页操作自理  

### 引用

```js
import EnhanceTable from "web-component/dist/enhanceTable";
import Vue from 'vue';
Vue.use(EnhanceTable);
```

### 组件入参

| name            | type                                                         | required | desc                                                         |
| --------------- | ------------------------------------------------------------ | -------- | ------------------------------------------------------------ |
| title           | string                                                       | f        | 表格的标题                                                   |
| showAddBtn      | boolean                                                      | f        | 控制"新增按钮"的显隐                                         |
| addBtnStr       | string                                                       | f        | "新增"按钮的文本                                             |
| showColSelector | boolean                                                      | f        | 控制列排序工具的显隐                                         |
| showHeader      | boolean                                                      | f        | 控制表头的显隐                                               |
| columns         | Column extends { checked: boolean, fixed: 'left' \| 'right' } [] | t        | 参考：https://1x.antdv.com/components/table-cn/#Colum，checked 全等于 false 时，表格里面不展示该字段，fixed 控制列在表格里的位置，跟antd官方的用法一致 |

### 注意

跟Antd官方给出的作用域插槽写法不同，此组件替换成下方的写法

```vue
// i是索引, text是record[col.dataIndex]的值
<template slot="name" slot-scope="{record, text, i}"></template>
```

### 方法

| 名称      | 说明                           | 类型               |     |
| --------- | ------------------------------ | ------------------ | --- |
| fetch(cb) | 供外部调用的方法，用于获取数据 | 用法见下方代码片段 |     |

```js
// father.vue
export default {
    methods: {
        fetchTable () {
            // 获取表格组件的引用
            this.$nextTick(() => {
                // startLoading, stopLoading 是控制loading状态的方法
                this.$refs.table.fetch(( { pageParams, dataSource }, startLoading, stopLoading ) => {
                    // 发请求，拿数据
                    // 这里可以进一步处理请求入参，
                    // 包括改页码参数，
                    // pageParams: {pageNum: number, pageSize: number}
                    yourFetchDataFunc({
                        ...pageParams,
                        ...yourParams,
                    }).then((res)=> {
                        const { total, records } = res;

                        // 注意，要通过 dataSource.value 来赋值
                        dataSource.value = rescords;
                        dataSource.total = total;
                    }).finally(stopLoading);
                })
            })
        }
	}
}
```

### 事件

| 名称 | 说明             |
| ---- | ---------------- |
| add  | 点击了“新增”按钮 |

