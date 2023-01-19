<template>
  <a-config-provider :locale="locale">
    <div id="enhance-table" class="enhance-table">
      <header v-if="showHeader" class="header" :style="headerStyle">
        <slot name="left">
          <div class="title">
            {{ title }}
          </div>
        </slot>
        <slot name="right">
          <div class="right">
            <a-button
              v-if="showAddBtn"
              type="primary"
              @click="add"
              icon="plus"
              >{{ addBtnStr }}</a-button
            >
            <col-selector
              v-if="showColSelector"
              style="margin: 0 0 0 16px"
              :columns="colSelectorColumns"
              @change="onColChange"
            >
              <img class="icon" :src="icon" alt="icon" />
            </col-selector>
          </div>
        </slot>
      </header>
      <a-table
        :scroll="{ x: true }"
        :loading="loading"
        :columns="selfColumns"
        :dataSource="selfDataSource.value"
        :pagination="genPagination()"
        :customHeaderRow="
          (c, i) => {
            return {
              style: {
                padding: '24px !important',
              },
            };
          }
        "
        v-bind="$attrs"
      >
        <template
          v-for="name in customRenders"
          :slot="name"
          slot-scope="text, record, i"
        >
          <slot :name="name" v-bind="{ text, record, i }"></slot>
        </template>
        <template v-for="slot in slots" :slot="slot">
          <slot :name="slot"></slot>
        </template>
        <template
          v-if="$slots.footer"
          slot="footer"
          slot-scope="currentPageData"
        >
          <slot name="footer" v-bind="{ currentPageData }"></slot>
        </template>
      </a-table>
    </div>
  </a-config-provider>
</template>
<script>
import antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import Vue from "vue";
import ColSelector from "./components/ColSelector/index.vue";
import icon from "./imgs/trigger.png";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { NormalTable } from "./config";

Vue.use(antd);

export default {
  name: "EnhanceTable",
  props: {
    columns: {
      type: Array,
      default: () => [],
      required: true,
    },
    selectorColumns: {
      type: Array,
      default: () => [],
      required: false,
    },
    title: {
      type: String,
      default: "title",
    },

    /**
     * 控制显隐prop
     */
    showAddBtn: {
      type: Boolean,
      default: true,
    },
    addBtnStr: {
      type: String,
      default: "添加",
    },
    showColSelector: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    headerStyle: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ColSelector,
  },

  watch: {
    columns: {
      handler(columns) {
        // 拷贝数组
        this.selfColumns = columns
          .filter((col) => col.checked !== false)
          .map((col) => {
            if (!col.customCell) {
              col.customCell = NormalTable.customCell;
            }
            if (!col.customHeaderCell) {
              col.customHeaderCell = NormalTable.customHeaderCell;
            }
            return { ...col };
          });
        this.colSelectorColumns = columns.map((col) => {
          return { ...col };
        });

        // 插槽
        this.customRenders = this.selfColumns
          .filter((col) => col?.scopedSlots?.customRender)
          .map((col) => col.scopedSlots.customRender);

        this.slots = this.selfColumns
          .filter((col) => col?.slots?.title)
          .map((col) => col.slots.title);
      },
      immediate: true,
    },
    dataSource: {
      handler(list) {
        this.selfDataSource.value = list;
      },
      deep: true,
      immediate: true,
    },
  },

  data() {
    return {
      icon,
      selfColumns: [],
      colSelectorColumns: [],
      customRenders: [],
      slots: [],
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      selfDataSource: {
        value: [],
        total: 0,
      },
      loading: false,
      locale: zhCN,
    };
  },
  methods: {
    _fetch() {},
    genPagination() {
      if (this.$attrs.pagination === false) return false;
      return (
        this.$attrs.pagination || {
          total: this.selfDataSource.total,
          current: this.pageParams.pageNum,
          onChange: this.onPageChange,
          onShowSizeChange: this.onPageChange,
          showTotal: (t) => `共${t}条数据`,
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["5", "10", "20", "30", "50"],
        }
      );
    },
    add() {
      this.$emit("add");
    },
    onColChange(params) {
      try {
        const { normal, left, right } = params;
        const genCols = (col, fixed = void 0) => {
          const tem = this.columns.find((column) => {
            return col.title === column.title;
          });
          return { ...tem, fixed };
        };

        const leftCols = left.map((col) => genCols(col, "left"));
        const rightCols = right.map((col) => genCols(col, "right"));
        const normalCols = normal.map((col) => genCols(col, void 0));

        this.selfColumns = leftCols.concat(normalCols, rightCols);
      } catch (error) {
        throw "columns数组里面每个项要必须是对象,且有字段title且值不为空";
      }
    },
    start() {
      this.loading = true;
    },
    stop() {
      this.loading = false;
    },
    setTotal(total) {
      this.selfDataSource.total = total;
    },

    fetch(cb) {
      this._fetch = cb;
      this._fetch(
        {
          pageParams: this.pageParams,
          dataSource: this.selfDataSource,
          setTotal: this.setTotal,
        },
        this.start,
        this.stop
      );
    },
    onPageChange(page, size) {
      this.pageParams.pageNum = page;
      this.pageParams.pageSize = size;
      this._fetch(
        {
          pageParams: this.pageParams,
          dataSource: this.selfDataSource,
          setTotal: this.setTotal,
        },
        this.start,
        this.stop
      );
    },
  },
};
</script>

<style lang="less">
@import "./style/index.less";
</style>
<style lang="less" scoped>
.enhance-table {
  background-color: #fff;
  border-radius: 4px;
  .header {
    height: 70px;
    padding: 24px 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      padding: 0 0 0 24px;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
    }
    .right {
      display: flex;
      align-items: center;

      .icon {
        width: 16px;
        height: 16px;
        object-fit: contain;
        margin: 0 24px 0 0;
        cursor: pointer;
        filter: grayscale(100%);

        &:hover {
          filter: none;
        }
      }
    }
  }
}
</style>
