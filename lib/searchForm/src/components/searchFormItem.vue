<template>
  <a-tooltip>
    <template v-if="value" slot="title">{{ tooltipStr }}</template>
    <label id="search-form-item-label" :for="label" :style="labelStyle">
      <div :class="`form-item ${focus && 'active'}`">
        <div class="label--txt">
          {{ label }}
          {{ colon ? ":" : "" }}
        </div>
        <template v-if="type !== 'rangePicker'">
          <component
            :id="label"
            :is="genAntCmpName(type)"
            v-model="value"
            ref="widget"
            @change="onChange"
            @keydown.enter="onSearch"
            @focus="onFocus"
            @blur="onBlur"
            v-bind="$attrs"
            v-on="$listeners"
            :allowClear="$attrs.allowClear || true"
            :maxTagCount="$attrs.maxTagCount || 1"
            :placeholder="genPlaceholder(type)"
          >
            <template slot="suffixIcon" v-if="/select/gi.test(type)">
              <a-icon type="caret-down" style="color: rgba(0, 0, 0, 0.25)" />
            </template>

            <template v-if="selections.length">
              <a-select-option
                v-for="item in selections"
                :value="item.value"
                :key="item.value"
              >
                <a-tooltip :title="item.name || item.label || item.title">
                  {{ item.name || item.label || item.title }}
                </a-tooltip>
              </a-select-option>
            </template>
          </component>
        </template>

        <a-range-picker
          v-else
          @change="onRangePickerChange"
          :value="value"
          v-bind="$attrs"
          v-on="$listeners"
          :allowClear="true"
        />
      </div>
    </label>
  </a-tooltip>
</template>

<script>
import antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import Vue from "vue";
import { ITEM_WIDTH } from "../const";

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
  ["rangePicker", "a-range-picker"],
  ["range-picker", "a-range-picker"],
  [void 0, "a-input"],
]);
export default {
  name: "SearchFormItem",

  inject: ["submit"],
  inject: {
    submit: {
      default: void 0,
    },
  },

  props: {
    // key name
    dataIndex: {
      type: String,
      default: "dataIndex",
      require: true,
    },
    width: {
      type: Number,
      default: ITEM_WIDTH,
    },
    minWidth: {
      type: Number,
    },
    type: {
      type: String,
      default: "input",
      require: true,
      validator(type) {
        if (!cmpMap.has(type)) {
          throw `unvalid type ${type}`;
        }
        return true;
      },
    },
    label: {
      type: String,
      default: "label",
      required: true,
    },

    selections: {
      type: Array,
      default: () => [],
    },
    colon: {
      type: Boolean,
      default: true,
    },

    delay: {
      type: Number,
      default: 100,
    },
  },

  data() {
    return {
      value: void 0,
      rangePickerStrValue: [],
      focus: false,
      trigger: false,

      // 防抖
      id: void 0,
    };
  },

  computed: {
    labelStyle() {
      const style = {};
      if (this.width && typeof this.width === "number") {
        style.width = this.width + "px";
      }
      if (this.minWidth && typeof this.minWidth === "number") {
        style.minWidth = this.minWidth + "px";
        delete style.width;
      }
      return style;
    },
    tooltipStr() {
      try {
        if (this.$attrs.mode === "tags") throw "to do";
        const get = (selected = {}) => {
          return selected.label || selected.title || selected.name;
        };
        const deepFind = (val, selections) => {
          const target = selections.find((select) => {
            let result = select.value === val;
            if (!result) {
              if (select?.children?.length) {
                result = deepFind(val, select.children);
              }
            }
            return result;
          });
          return target;
        };
        // tree-select multiple
        if (
          this.type.match(/treeSelect|tree-select/gi) &&
          this.$attrs.multiple &&
          this.$attrs?.treeData?.length
        ) {
          const tem = [];
          for (let v of this.value) {
            const selected = deepFind(v, this.$attrs.treeData);
            tem.push(get(selected));
          }
          return tem.join(",");
        }
        if (
          this.type.match(/treeSelect|tree-select/gi) &&
          this.$attrs?.treeData?.length
        ) {
          const selected = deepFind(this.value, this.$attrs.treeData);
          return get(selected);
        }
        // select multiple tags ...
        if (
          this.type === "select" &&
          this.$attrs.mode === "multiple" &&
          this?.selections?.length
        ) {
          const tem = [];
          for (let v of this.value) {
            const selected = this.selections.find(
              (select) => select.value === v
            );
            tem.push(get(selected));
          }
          return tem.join(",");
        }
        if (this.type === "select") {
          const selected = this.selections.find(
            (select) => select.value === this.value
          );
          return get(selected);
        }

        if (this.rangePickerStrValue.length) {
          return this.rangePickerStrValue.join(" ~ ");
        }
        return this.value;
      } catch (error) {
        console.warn(error);
      }
    },
  },

  methods: {
    genPlaceholder(type) {
      if (this?.$attrs?.placeholder) return this.$attrs.placeholder;
      if (type?.match(/select/gi)) return "请选择";
      return "请选择";
    },
    onFocus() {
      this.focus = true;
      if (this.type !== "default") return;
      this.$refs?.widget?.$el?.focus();
    },
    onBlur() {
      this.focus = false;
    },

    reset() {
      this.value = void 0;
      this.rangePickerStrValue = void 0;
    },
    genAntCmpName(type) {
      return cmpMap.get(type);
    },
    emit() {
      if (!this.submit) return;
      if (this.id) {
        clearTimeout(this.id);
        this.id = void 0;
      }
      this.id = setTimeout(() => {
        this.submit({ [this.dataIndex]: this.value });
        this.id = void 0;
      }, this.delay);
    },
    onRangePickerChange(date, dateStr) {
      this.value = date;
      this.rangePickerStrValue = dateStr;
      this.emit();
    },
    onChange(val) {
      if (val instanceof PointerEvent) {
        this.value = void 0;
      } else if (val instanceof InputEvent) {
        this.value = val?.target?.value || void 0;
      } else if (val instanceof Event) {
        this.value = val?.target?.value || void 0;
      } else this.value = val;
      /**
       * 适配没有使用search-form作为容器包括当前组件的情况
       */
      this.emit();
    },
    onSearch() {
      typeof this.submit === "function" && this.submit();
    },
  },
};
</script>

<style lang="less">
@import "./index.less";
</style>
<style lang="less" scoped>
.form-item {
  display: flex;
  flex-wrap: nowrap;
  padding: 0 0 0 12px;
  align-items: center;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
  transition: all 0.2s;
  position: relative;

  &:focus,
  &:active,
  &:hover {
    border: 1px solid #0068fb;
  }

  &.active {
    border: 1px solid #0068fb;
  }

  .label--txt {
    display: flex;
    align-items: center;
    word-break: break-all;
    flex: 1 0 auto;
  }

  * {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
