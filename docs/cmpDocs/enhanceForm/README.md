# EnhanceForm 表单

### 描述
基于antd的表单进行了二次封装，以数组声明式驱成表单，并且封装了常用的功能接口

### live demo
<ClientOnly>
  <enhance-form-demo></enhance-form-demo>
</ClientOnly>

::: details 点击查看代码
```vue
<template>
  <div>
    <enhance-form :columns="fields" ref="form" @change="change"></enhance-form>
    <a-button @click="validateFields">校验表单</a-button>
    <a-button @click="setFieldsValue">设置表单值</a-button>
    <a-button @click="resetFields">重置</a-button>
    <a-button @click="getFieldsValue">读取值</a-button>
  </div>
</template>

<script>
import fields from "./fields";
export default {
  name: "EnhanceFormDemo",
  data() {
    return {
      fields: [
        {
          label: "数据源类型",
          dataIndex: "sourceType",
          type: "select",
          selections: [
            {
              key: "mysql",
              label: "mysql",
              value: "mysql",
            },
            {
              key: "postgresql",
              label: "postgresql",
              value: "postgresql",
            },
            {
              key: "oracle",
              label: "oracle",
              value: "oracle",
            },
            {
              key: "sqlserver",
              label: "sqlserver",
              value: "sqlserver",
            },
            {
              key: "magiledb",
              label: "magiledb",
              value: "magiledb",
            },
            {
              key: "hana",
              label: "hana",
              value: "hana",
            },
            {
              key: "dm",
              label: "dm",
              value: "dm",
            },
            {
              key: "db2",
              label: "db2",
              value: "db2",
            },
            {
              key: "sybase",
              label: "sybase",
              value: "sybase",
            },
            {
              key: "elasticsearch",
              label: "elasticsearch",
              value: "elasticsearch",
            },
            {
              key: "mongodb",
              label: "mongodb",
              value: "mongodb",
            },
            {
              key: "redis",
              label: "redis",
              value: "redis",
            },
            {
              key: "hdfs",
              label: "hdfs",
              value: "hdfs",
            },
            {
              key: "ftp",
              label: "ftp",
              value: "ftp",
            },
            {
              key: "sftp",
              label: "sftp",
              value: "sftp",
            },
            {
              key: "magileobs",
              label: "magileobs",
              value: "magileobs",
            },
            {
              key: "hive",
              label: "hive",
              value: "hive",
            },
            {
              key: "greenplum",
              label: "greenplum",
              value: "greenplum",
            },
            {
              key: "magilelake",
              label: "magilelake",
              value: "magilelake",
            },
            {
              key: "kafka",
              label: "kafka",
              value: "kafka",
            },
            {
              key: "api",
              label: "api",
              value: "api",
            },
          ],
          disabled: true,
        },
        {
          label: "数据源名称",
          type: "input",
          dataIndex: "name",
          maxLength: 30,
          placeholder: "请输入",
          rules: [
            {
              required: true,
              message: "请输入",
            },
          ],
        },
        {
          label: "主机地址",
          type: "input",
          dataIndex: "address",
          placeholder: "请输入",
          rules: [
            {
              required: true,
              message: "请输入",
            },
            {
              pattern: {},
              message: "只可以输入数字,英文,半角逗号,半角句号",
            },
          ],
        },
        {
          label: "端口号",
          type: "number",
          dataIndex: "port",
          max: 65535,
          min: 1,
          placeholder: "请输入",
          rules: [
            {
              required: true,
              message: "请输入",
            },
          ],
        },
        {
          label: "用户名",
          type: "input",
          editable: false,
          dataIndex: "username",
          maxLength: 30,
          rules: [
            {
              required: true,
              message: "请输入",
            },
          ],
        },
        {
          label: "密码",
          type: "password",
          editable: false,
          dataIndex: "password",
          maxLength: 30,
          rules: [
            {
              required: true,
              message: "请输入",
            },
          ],
        },
        {
          label: "数据库名称",
          type: "input",
          dataIndex: "databaseName",
          maxLength: 30,
          rules: [
            {
              required: true,
              message: "请输入",
            },
          ],
        },
        {
          label: "连接参数",
          type: "textarea",
          dataIndex: "sourceParam",
          maxLength: 500,
          required: false,
        },

        {
          label: "数据库用途",
          dataIndex: "databaseUsage",
          type: "select",
          selections: [
            {
              value: 0,
              label: "业务库",
            },
            {
              value: 1,
              label: "中心库",
            },
            {
              value: 99,
              label: "前置库",
            },
            {
              value: 100,
              label: "其他",
            },
          ],
          initialValue: 0,
          rules: [
            {
              required: true,
              message: "请选择",
            },
          ],
          minWidth: 216,
        },
        {
          label: "环境类型",
          type: "select",
          dataIndex: "databaseEnv",
          selections: [
            {
              value: 0,
              label: "其他",
            },
            {
              value: 1,
              label: "开发库",
            },
            {
              value: 2,
              label: "正式库",
            },
          ],
          initialValue: 0,
          rules: [
            {
              required: true,
              message: "请选择",
            },
          ],
        },
        {
          label: "所属机构",
          dataIndex: "deptId",
          type: "treeSelect",
          treeData: [
            {
              label: "集团",
              key: 274,
              value: 274,
              name: "集团",
              selectable: false,
              children: [
                {
                  label: "公司",
                  key: 275,
                  value: 275,
                  name: "公司",
                  selectable: true,
                  children: [
                    {
                      label: "abc",
                      key: 491,
                      value: 491,
                      name: "abc",
                      selectable: true,
                    },
                    {
                      label: "def",
                      key: 493,
                      value: 493,
                      name: "def",
                      selectable: true,
                    },
                  ],
                },

                {
                  label: "外部机构",
                  key: 399,
                  value: 399,
                  name: "外部机构",
                  selectable: false,
                  children: [
                    {
                      label: "测试管理组",
                      key: 488,
                      value: 488,
                      name: "测试管理组",
                      selectable: true,
                      children: [
                        {
                          label: "测试子机构",
                          key: 489,
                          value: 489,
                          name: "测试子机构",
                          selectable: true,
                        },
                      ],
                    },
                    {
                      label: "YL-测试",
                      key: 490,
                      value: 490,
                      name: "YL-测试",
                      selectable: true,
                    },
                  ],
                },
              ],
            },
          ],
          placeholder: "请选择",
        },
        {
          label: "所属目录",
          dataIndex: "resourceId",
          type: "treeSelect",
          treeData: [
            {
              label: "测试数据源",
              key: "5a1c248db56a4cbcbd36e00cf554e562",
              value: "5a1c248db56a4cbcbd36e00cf554e562",
              name: "测试数据源",
            },
            {
              label: "前置数据源",
              key: "f59786d8ea8f43ff837c9334b73e07fd",
              value: "f59786d8ea8f43ff837c9334b73e07fd",
              name: "前置数据源",
            },
            {
              label: "中心数据源",
              key: "c4efdf422e384dfbb6ed4960269c3af0",
              value: "c4efdf422e384dfbb6ed4960269c3af0",
              name: "中心数据源",
            },
            {
              label: "业务数据源",
              key: "4d0e7866ba0d4aabbfa5397055af3854",
              value: "4d0e7866ba0d4aabbfa5397055af3854",
              name: "业务数据源",
            },
          ],
          rules: [
            {
              required: true,
              message: "请选择",
            },
          ],
        },
        {
          label: "责任人",
          dataIndex: "ownerList",
          type: "select",
          mode: "multiple",
          selections: [
            {
              label: "admin",
              value: '{"ownerId":1,"ownerName":"admin"}',
              key: 1,
              name: "admin",
            },
            {
              label: "shareAdmin",
              value: '{"ownerId":17,"ownerName":"shareAdmin"}',
              key: 17,
              name: "shareAdmin",
            },
            {
              label: "test1",
              value: '{"ownerId":18,"ownerName":"test1"}',
              key: 18,
              name: "test1",
            },
            {
              label: "lzt123",
              value: '{"ownerId":20,"ownerName":"lzt123"}',
              key: 20,
              name: "lzt123",
            },
            {
              label: "IT",
              value: '{"ownerId":420,"ownerName":"IT"}',
              key: 420,
              name: "IT",
            },
          ],
          placeholder: "请选择",
          rules: [
            {
              required: true,
              message: "请选择",
            },
          ],
          minWidth: 216,
        },
        {
          label: "监测频率(分钟)",
          dataIndex: "cycleCheckTime",
          type: "number",
          initialValue: 3,
          rate: 0.25,
          min: 0,
          precision: 0,
        },
        {
          label: "监测失败次数(次)",
          dataIndex: "retryTimes",
          type: "number",
          initialValue: 2,
          rate: 0.25,
          min: 0,
          precision: 0,
        },
        {
          label: "告警方式",
          dataIndex: "alarmType",
          type: "select",
          selections: [
            {
              value: 1,
              label: "系统通知",
            },
          ],
          initialValue: 1,
          rules: [
            {
              required: true,
              message: "请选择",
            },
          ],
        },
        {
          label: "描述",
          type: "textarea",
          dataIndex: "remark",
          maxLength: 500,
        },
      ],
    };
  },
  mounted() {},
  methods: {
    change(values) {
      console.warn({ values });
    },
    validateFields() {
      this.$refs.form.validateFields((error, values) => {
        console.warn({ error, values });
      });
    },
    setFieldsValue() {
      this.$refs.form.setFieldsValue({ name: "测试输入" });
    },
    getFieldsValue() {
      const values = this.$refs.form.getFieldsValue();
      console.warn({ values });
    },
    resetFields() {
      this.$refs.form.resetFields();
    },
  },
};
</script>
```
:::


### EnhanceForm 组件事件

| name    | type                                          | desc                             |
| ------- | --------------------------------------------- | -------------------------------- |
| @change | Function (values: {/** 抛出的表单对象 */}) {} | 当组件内的控件被用户输入时会触发 |

### EnhanceForm 组件方法

*通过`$ref.{searchForm}`来调用*

| name            | type                                             | desc                                                          |
| --------------- | ------------------------------------------------ | ------------------------------------------------------------- |
| validateFields  | Function (cb: Function(err, values):void ): void | err是校验错误对象，若不为null，即表单校验失败，values是表单值 |
| setFieldsValue  | Function (values): void                          | 设置表单的值                                                  |
| getFieldsValues | Function (): {/** 表单对象 */}                   | 获取表单的值                                                  |
| resetFields     | Function (): void                                | 重置表单的值                                                  |




### EnhanceForm  组件入参

| name    | type     | required | desc           |
| ------- | -------- | -------- | -------------- |
| columns | Column[] | t        | 声明的表单数组 |

```ts
interface Column {
  dataIndex: string; // 字段的key
  label: string; // label文本
  type:
    | "input"
    | "select"
    | "textarea"
    | "treeSelect"
    | "password"
    | "number"
    | "radio"
    | "datePicker"; // 表单项类型
  allowClear: boolean;
  selections: Selection[];
  placeholder: string;
  treeData?: TreeNode[]; // 当表单项type为treeSelect时生效
  initialValue?: string | number; // 初始值
  maxLength?: number;
  max?: number;
  min?: number;
  precision?: number; // 精度
  rate?: 1 | 0.5 | 0.33 | 0.333 | 0.3333 | 0.25; // 默认为1，表示表单项占据一行，0.5表示占据半行，即表单可以为两列布局，0.33表示以3列布局，0,25表示以4列布局
  disabled?: boolean;
  readonly?: boolean;
}
interface Selection {
  value: number | string;
  label: string;
  selectable?: boolean;
  key?: number | string;
}
interface TreeNode {
  label: string;
  value: number | string;
  name: string;
  selectable: boolean;
  children: TreeNode[];
}
```


