
# 编辑树
### 描述
支持搜索高亮，可编辑
### live demo
<ClientOnly>
  <edit-tree-demo1></edit-tree-demo1>
</ClientOnly>

::: details 点击查看代码
```vue
<template>
  <div>
    <edit-tree
      title="your title"
      @add="add"
      @rename="rename"
      @expand="expand"
      @submit="submit"
      @delete="del"
      @addRoot="addRoot"
      @select="select"
      ref="tree"
    >
      <template slot="nodeRight" slot-scope="{ record }">
        <a-dropdown>
          <span
            class="icon-wrap g-flex g-justify-center g-align-center"
            ref="iconWrap"
          >
            自定义右侧节点 {{ record.title }}
          </span>

          <a-menu slot="overlay">
            <a-menu-item> gg </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
      <template slot="test">自定义图标插槽</template>
    </edit-tree>
  </div>
</template>

<script>
let value = 0;
const genList = (deep = 5) => {
  if (deep <= 0) return [];
  const len = Math.ceil(Math.random() * 10);
  return new Array(len).fill(0).map((_, i) => {
    const tem = {
      title: `level:${deep}index:${i}`,
      value,
      slots: {
        icon: "test",
      },
    };
    value++;
    tem.children = genList(deep - 1);
    return tem;
  });
};

export default {
  name: "EditTreeView",
  data() {
    return {
      list: [],
    };
  },

  mounted() {
    this.$refs.tree.fetch(
      ({ pageParams, treeData, select }, startLoading, stopLoading) => {
        treeData.value = genList(3);
      }
    );
  },
  methods: {
    addRoot({ addRoot }) {
      addRoot();
    },
    add(item, { addChild }) {
      addChild();
    },
    rename(item, { rename }) {
      rename();
    },
    expand(item, {}) {},
    submit(item) {},
    del(item, options) {},
    select(item) {},
  },
};
</script>
```
:::

### 例子2:自定义节点的右侧、节点的图标

<ClientOnly>
  <edit-tree-demo2></edit-tree-demo2>
</ClientOnly>

::: details 点击查看代码
```vue
<template>
  <div>
    <edit-tree
      title="your title"
      @add="add"
      @rename="rename"
      @expand="expand"
      @submit="submit"
      @delete="del"
      @addRoot="addRoot"
      @select="select"
      ref="tree"
    ></edit-tree>
  </div>
</template>

<script>
let value = 0;
const genList = (deep = 5) => {
  if (deep <= 0) return [];
  const len = Math.ceil(Math.random() * 10);
  return new Array(len).fill(0).map((_, i) => {
    const tem = {
      title: `level:${deep}index:${i}`,
      value,
      menus: [
        {
          title: "新增",
          eventType: "add",
        },
        {
          title: "改名",
          eventType: "rename",
        },
        {
          title: "删除",
          eventType: "delete",
        },
      ],
    };
    value++;
    tem.children = genList(deep - 1);
    return tem;
  });
};

export default {
  name: "EditTreeView",

  data() {
    return {
      list: [],
    };
  },

  mounted() {
    this.$refs.tree.fetch(
      ({ pageParams, treeData, select }, startLoading, stopLoading) => {
        treeData.value = genList(3);
      }
    );
  },
  methods: {
    addRoot({ addRoot }) {
      addRoot();
    },
    add(item, { addChild }) {
      addChild();
    },
    rename(item, { rename }) {
      rename();
    },
    expand(item, {}) {},
    submit(item) {},
    del(item, options) {},
    select(item) {},
  },
};
</script>
```
:::

### 入参

- treeData: TreeData[]

  ```ts
  interface Menu {
      title: string,
      eventType: string,
      visible?: boolean
  }
  interface TreeData {
      title: string,
      value: any,
      
      // 子节点是否可见
      childrenVisible?: boolean,
      // 是否处于可编辑状态
      edit?: boolean,
      // 节点及其子节点是否可见
      visible?: boolean,
      // 节点的子节点是否通过点击展开来动态查询
      canLoad?: boolean
     
      menus?: Menu[],
      slots?: {
        icon?: string // 自定义图标插槽名称
      }
      selectable?: boolean // 是否能选中
  }
  
  ```
- showHeader 是否展示头部
- title 头部标题内容
- headerLeftStyle 头部左侧容器样式
- lock 是否不能取消选中
- delay 搜索的延时
- inputStyle 输入框的样式
- confirmText 输入框提交按钮的文本
- cancelText 输入框取消按钮的文本
- tooltipText “+”按钮的title文本
- mode 默认是'default',多选是'multiple'

  

### 方法

- fetch 接收一个回调函数 callback
  ```ts
  function callback({ pageParams, treeData, select }, startLoading, stopLoading) {
                      // startLoading, stopLoading 是控制loading状态的方法
      				// 发请求，拿数据
                      // 这里可以进一步处理请求入参，
                      // 包括改页码参数，
                      // pageParams: {pageNum: number, pageSize: number}
                      yourFetchDataFunc({
                          ...pageParams,
                          ...yourParams,
                      }).then((res)=> {
                          const { total, records } = res;
  
                          // 注意，要通过 treeData.value 来赋值
                          treeData.value = rescords;
                          treeData.total = total;
                          // select 方法接收要选中节点的value
                          // 在mode='multiple'时，接收节点值的数组
                          // select() 
                      }).finally(stopLoading);
  }
  ```

### 事件:

- addRoot 点击了右上角增加按钮，添加根节点事件
- reload 点击了右上角刷新的按钮-刷新事件


- expand 当节点的options.canLoad为真时，点击展开箭头会触发此事件
   ```ts
   function expand(item, {
    expanded: boolean, 
    open: Function,
    close: Function,
  }, startLoading: Function, stopLoading: Function) {
      
  }
  ```
- {menu.eventType}
    ```ts
    function eventType (item, {
        addChild,
        rename,
    }, startLoading, stopLoading) {
      // 执行addChild可以插入一个输入框子节点
      // 执行rename可以将当前节点替换成一个输入框
      // 执行startLoading可以开始组件的loading状态
      // 执行stopLoading可以结束组件的loading状态
    }
    ```

- submit

  ```ts
  function submit (eventType, item: TreeData) {
      
  }
  ```

- select

  ```ts
  // mode是'default'单选状态下
  function select (value: TreeData.value, params: {target: TreeData}) {
  }
  // mode是'multiple'多选状态下
  function select (values: TreeData.value[], params: {targets: TreeData[]}) {

  }
  ```

  
