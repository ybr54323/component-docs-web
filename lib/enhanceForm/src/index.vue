<template>
  <a-form :form="form" :layout="formLayout" id="enhance-form">
    <div class="field-wrap">
      <div
        class="field-box col"
        v-for="item in columns"
        :key="item.dataIndex"
        :style="{
          flex: genFlex(item),
        }"
      >
        <a-form-item :label="item.label" :colon="item.colon">
          <a-tree-select
            v-if="item.type === 'treeSelect' || item.type === 'tree-select'"
            :treeData="item.treeData"
            v-decorator="[
              item.dataIndex,
              {
                rules: item.rules,
                initialValue: item.initialValue,
              },
            ]"
            v-bind="item"
            @change="change"
            :showArrow="true"
          />
          <component
            v-else
            :showArrow="true"
            :is="genField(item.type)"
            v-bind="item"
            v-decorator="[
              item.dataIndex,
              {
                rules: item.rules,
                initialValue: item.initialValue,
              },
            ]"
            :placeholder="item.placeholder || genPh(item.type)"
            @change="change"
          >
            <template v-if="isSelect(item.type)">
              <a-select-option
                v-for="selection in item.selections"
                :value="selection.value"
                :key="selection.value"
                :disabled="selection.disabled"
              >
                {{ selection.label }}
              </a-select-option>
            </template>
          </component>
        </a-form-item>
        <template v-if="item.slots">
          <div class="header-left">
            <slot :name="item.slots.left"> </slot>
          </div>
        </template>
      </div>
    </div>
  </a-form>
</template>
<script>
import antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import Vue from "vue";
Vue.use(antd);

const cmpMap = new Map([
  ["input", "a-input"],
  ["select", "a-select"],
  ["tree-select", "a-tree-select"],
  ["treeSelect", "a-tree-select"],
  ["textarea", "a-textarea"],
  ["area", "a-textarea"],
  ["password", "a-input-password"],
  ["number", "a-input-number"],
  ["radio", "a-radio-group"],

  ["datePicker", "a-date-picker"],
  ["date-picker", "a-date-picker"],
  ["a-date-picker", "a-date-picker"],
  [void 0, "a-input"],
]);

export default {
  name: "EnhanceForm",
  props: {
    columns: {
      type: Array,
      default: () => [],
      required: true,
      validator(cols) {
        for (let i = 0; i < cols.length; i++) {
          const col = cols[i];
          if (!col) {
            throw "!col";
          }
          if (!col.label) {
            throw `${JSON.stringify(col)} has no label`;
          }
          if (!col.dataIndex) {
            throw `${JSON.stringify(col)} has no dataIndex`;
          }
        }
        return true;
      },
    },
    formLayout: {
      type: String,
      default: "vertical",
    },
  },

  data() {
    return {
      form: this.$form.createForm(this),
    };
  },
  methods: {
    genFlex(column) {
      // 一列
      const full = "calc(100%)";
      // 两列
      const half = "calc(50% - 12px)";

      const third = `calc(${100 / 3}% - 12px)`;

      const quarter = `calc(${100 / 4}% - 18px)`;

      const map = new Map([
        [1, full],
        ["100%", full],
        [0.5, half],
        ["50%", half],
        [0.3333, third],
        [0.333, third],
        [0.33, third],
        ["33.33%", third],
        ["33.3%", third],
        ["33%", third],
        [0.25, quarter],
        ["25%", quarter],
        // 默认两列
        [void 0, half],
      ]);
      return "0 0 " + map.get(column.rate);
    },
    genField(type) {
      const name = cmpMap.get(type);
      if (!name) throw "unvalid type: " + type;
      return name;
    },
    isSelect(type) {
      return type.match(/select/gi);
    },
    hasSelections(item) {
      const a = item?.selections?.length;
      const b = item?.selections?.every((selection) => {
        return (selection.value || selection.value === 0) && selection.label;
      });
      if (!b) {
        console.warn(item);
        throw "unvalid selections";
      }
      return a && b;
    },
    validateFields(cb) {
      this.form.validateFields((e, v) => {
        cb(e, v, () => {
          this.form.resetFields();
        });
      });
    },
    setFieldsValue(params) {
      this.form.setFieldsValue(params);
    },
    getFieldsValue() {
      return this.form.getFieldsValue();
    },
    genPh(t) {
      if (t.match(/input|textarea|area|password|number/gi)) return "请输入";
      if (t.match(/select|radio/gi)) return "请选择";
      return "";
    },
    change() {
      const prevValue = this.form.getFieldsValue();
      this.$nextTick(() => {
        this.$emit("change", this.form.getFieldsValue(), prevValue);
      });
    },
    resetFields() {
      this.form.resetFields();
    },
  },
};
</script>
<style lang="less">
@import "./style/index.less";
</style>
<style scoped lang="less">
.field-wrap {
  gap: 0 24px;
  display: flex;
  flex-wrap: wrap;
  .col {
    position: relative;
    flex: 0 0 calc(~"50% - 12px");
    .header-left {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  /deep/ .ant-calendar-picker {
    width: 100%;
  }
}
</style>
