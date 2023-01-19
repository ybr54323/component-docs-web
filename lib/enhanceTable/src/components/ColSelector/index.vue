<template>
  <div id="col-selector" class="col-selector">
    <a-popover
      :placement="placement"
      :getPopupContainer="(node) => node.parentNode"
    >
      <template slot="title">
        <header class="col-selector-header">
          <div class="left">
            <a-checkbox
              :indeterminate="indeterminate"
              :checked="checkAll"
              @change="onCheckAllChange"
            >
              列展示
            </a-checkbox>
          </div>
          <div class="right">
            <a href="javascript:;" @click="reset">重置</a>
          </div>
        </header>
      </template>
      <slot></slot>
      <template slot="content">
        <div class="col-selector-content">
          <template v-if="showTopDesc">
            <span class="desc">固定在列首</span>
            <draggable
              v-model="topColumns"
              @change="onDragChange"
              filter=".disabled"
            >
              <transition-group name="top" tag="div">
                <div
                  v-for="(col, i) in topColumns"
                  :key="col.title"
                  :class="col.disabled && 'disabled'"
                >
                  <div
                    class="row"
                    @mouseenter="topHoverIndex = i"
                    @mouseleave="topHoverIndex = -1"
                  >
                    <div class="left">
                      <a-checkbox
                        :disabled="(!canChange && col.checked) || col.disabled"
                        v-model="col.checked"
                        @change="onCheckChange(col, $event)"
                      >
                        <span class="txt">
                          {{ col.title || '需要列的名称"col.title"' }}
                        </span>
                      </a-checkbox>
                    </div>
                    <div
                      v-if="topHoverIndex === i && !col.disabled"
                      class="right"
                    >
                      <a-tooltip title="不固定">
                        <img
                          @click="cancel(topColumns, i)"
                          class="icon"
                          src="./imgs/cancel.png"
                          alt="icon"
                        />
                      </a-tooltip>
                      <a-tooltip title="固定在队尾">
                        <img
                          @click="toBottom(topColumns, i)"
                          class="icon"
                          src="./imgs/toBottom.png"
                          alt="icon"
                        />
                      </a-tooltip>
                    </div>
                  </div>
                </div>
              </transition-group>
            </draggable>
          </template>

          <span v-if="showMidDesc" class="desc">不固定</span>
          <draggable v-model="selfColumns" @change="onDragChange">
            <transition-group name="mid" tag="div">
              <div
                v-for="(col, i) in selfColumns"
                :key="col.title"
                :class="col.disabled && 'disabled'"
              >
                <div
                  class="row"
                  @mouseenter="midHoverIndex = i"
                  @mouseleave="midHoverIndex = -1"
                >
                  <div class="left">
                    <a-checkbox
                      :disabled="(!canChange && col.checked) || col.disabled"
                      v-model="col.checked"
                      @change="onCheckChange(col, $event)"
                    >
                      <span class="txt">
                        {{ col.title || '需要列的名称"col.title"' }}
                      </span>
                    </a-checkbox>
                  </div>
                  <div
                    v-if="midHoverIndex === i && !col.disabled"
                    class="right"
                  >
                    <a-tooltip title="固定在列首">
                      <img
                        @click="toTop(selfColumns, i)"
                        class="icon"
                        src="./imgs/toTop.png"
                        alt="icon"
                      />
                    </a-tooltip>
                    <a-tooltip title="固定在列尾">
                      <img
                        @click="toBottom(selfColumns, i)"
                        class="icon"
                        src="./imgs/toBottom.png"
                        alt="icon"
                      />
                    </a-tooltip>
                  </div>
                </div>
              </div>
            </transition-group>
          </draggable>
          <template v-if="showBottomDesc">
            <span class="desc">固定在列尾</span>
            <draggable v-model="bottomColumns" @change="onDragChange">
              <transition-group name="bottom" tag="div">
                <div
                  v-for="(col, i) in bottomColumns"
                  :key="col.title"
                  :class="col.disabled && 'disabled'"
                >
                  <div
                    class="row"
                    @mouseenter="bottomHoverIndex = i"
                    @mouseleave="bottomHoverIndex = -1"
                  >
                    <div class="left">
                      <a-checkbox
                        :disabled="(!canChange && col.checked) || col.disabled"
                        v-model="col.checked"
                        @change="onCheckChange(col, $event)"
                      >
                        <span class="txt">
                          {{ col.title || '需要列的名称"col.title"' }}
                        </span>
                      </a-checkbox>
                    </div>
                    <div
                      v-if="bottomHoverIndex === i && !col.disabled"
                      class="right"
                    >
                      <a-tooltip title="不固定">
                        <img
                          @click="cancel(bottomColumns, i)"
                          class="icon"
                          src="./imgs/cancel.png"
                          alt="icon"
                        />
                      </a-tooltip>
                      <a-tooltip title="固定在队首">
                        <img
                          @click="toTop(bottomColumns, i)"
                          class="icon"
                          src="./imgs/toTop.png"
                          alt="icon"
                        />
                      </a-tooltip>
                    </div>
                  </div>
                </div>
              </transition-group>
            </draggable>
          </template>
        </div>
      </template>
    </a-popover>
  </div>
</template>

<script>
import antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import Vue from "vue";
import draggable from "vuedraggable";
Vue.use(antd);

const genCheckCol = (col, checked = true) => {
  return {
    title: col.title,
    fixed: col.fixed,
    disabled: col.disabled, // 不能取消
    checked: col.checked === false ? false : checked,
  };
};
export default {
  name: "ColSelector",
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    placement: {
      type: String,
      default: "leftTop",
    },
  },
  components: {
    draggable,
  },
  data() {
    return {
      indeterminate: false,
      checkAll: true,
      key: 0,
      topColumns: [],
      topHoverIndex: -1,
      selfColumns: [],
      midHoverIndex: -1,
      bottomColumns: [],
      bottomHoverIndex: -1,
    };
  },
  computed: {
    showMidDesc() {
      return this.topColumns.length || this.bottomColumns.length;
    },
    showTopDesc() {
      return this.topColumns.length;
    },
    showBottomDesc() {
      return this.bottomColumns.length;
    },
    canChange() {
      return (
        [...this.selfColumns, ...this.topColumns, ...this.bottomColumns].filter(
          (col) => col.checked
        ).length > 1
      );
    },
  },

  watch: {
    columns: {
      handler(columns) {
        const { left, right, mid } = this.genFromOriginColumns(columns);
        this.topColumns = left;
        this.bottomColumns = right;
        this.selfColumns = mid;
        this.trigger();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    genFromOriginColumns() {
      const left = [],
        right = [],
        mid = [];
      this.columns.forEach((col) => {
        const c = genCheckCol(col);
        switch (c.fixed) {
          case "left":
            left.push(c);
            break;
          case "right":
            right.push(c);
            break;
          default:
            mid.push(c);
        }
      });
      return { left, mid, right };
    },
    onDragChange() {
      this.emit();
    },
    toBottom(columns, i) {
      this.bottomColumns.push(columns.splice(i, 1).pop());
      this.emit();
    },
    cancel(columns, i) {
      this.selfColumns.push(columns.splice(i, 1).pop());
      this.emit();
    },
    toTop(columns, i) {
      this.topColumns.push(columns.splice(i, 1).pop());
      this.emit();
    },
    reset() {
      // TODO:
      const { left, right, mid } = this.genFromOriginColumns(this.columns);
      this.topColumns = left;
      this.bottomColumns = right;
      this.selfColumns = mid;
      this.emit();
    },
    emit() {
      this.$emit("change", {
        left: this.topColumns.filter((col) => col.checked),
        normal: this.selfColumns.filter((col) => col.checked),
        right: this.bottomColumns.filter((col) => col.checked),
      });
    },
    onCheckAllChange(e) {
      const checked = e.target.checked;

      [...this.topColumns, ...this.selfColumns, ...this.bottomColumns].forEach(
        (col) => {
          if (col.disabled) return;
          col.checked = checked;
        }
      );

      this.trigger();
      this.emit();
    },
    onCheckChange() {
      this.trigger();
      this.emit();
    },

    trigger() {
      const tem = [
        ...this.topColumns,
        ...this.selfColumns,
        ...this.bottomColumns,
      ];

      const allChecked = tem.every((col) => col.checked);
      const checkedLen = tem.filter((col) => col.checked).length;

      // false 要么全选 要么全不选
      this.indeterminate = !!checkedLen && checkedLen < this.columns.length;
      this.checkAll = allChecked;
    },
  },
};
</script>
<style lang="less">
@import "./style/index.less";
</style>
<style lang="less" scoped>
.col-selector {
  display: flex;
  align-items: center;
}
.col-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 220px;
  max-width: 220px;
  .left {
  }
  .right {
    .icon {
      width: 16px;
      height: 16px;
      object-fit: contain;
      cursor: pointer;
    }
  }
}
.col-selector-content {
  max-height: 500px;
  overflow: auto;
  padding: 12px 16px;
  .disabled {
    cursor: not-allowed;
  }
  .desc {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.25);
    line-height: 20px;
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
    white-space: nowrap;
    flex-wrap: nowrap;
    height: 28px;
    &:hover {
      background: #e7eefb;
    }
    .left {
      .txt {
        user-select: none;
        cursor: move;
      }
    }

    .right {
      display: flex;
      align-items: center;
      .icon {
        width: 16px;
        height: 16px;
        object-fit: contain;
      }
    }
  }
  .txt-checkbox {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 20px;
  }
}
</style>
