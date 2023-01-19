<template>
  <div class="edit-tree">
    <slot name="header">
      <div class="header" v-if="showHeader">
        <div class="left">
          <slot name="headerLeft">
            {{ title }}
          </slot>
        </div>
        <div class="right" v-if="showHeaderRight">
          <slot name="headerRight">
            <a class="btn" href="javascript:;">
              <img
                @click="reload"
                class="icon reload"
                src="./imgs/reload.png"
                alt="reload"
              />
            </a>
            <a href="javascript:;">
              <a-tooltip>
                <div slot="title">
                  {{ tooltipText }}
                </div>

                <img
                  @click="addRoot"
                  class="icon"
                  src="./imgs/plus.png"
                  alt="plus"
                />
              </a-tooltip>
            </a>
          </slot>
        </div>
      </div>
    </slot>

    <a-input-search
      style="margin: 0 auto 12px"
      placeholder="请输入搜索关键词"
      v-model="keyword"
      :allowClear="true"
    ></a-input-search>
    <a-spin :spinning="loading">
      <edit-tree-node :treeData="list">
        <template slot="nodeRight" slot-scope="{ record, index }">
          <slot name="nodeRight" :record="record" :index="index"></slot>
        </template>

        <template v-for="item in icons" :slot="item">
          <slot :name="item"> </slot>
        </template>
      </edit-tree-node>
    </a-spin>
  </div>
</template>

<script>
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import Vue from "vue";
import EditTreeNode from "./editTreeNode.vue";
import cloneDeep from "lodash/cloneDeep";

Vue.use(Antd);
export default {
  name: "EditTree",
  provide() {
    return {
      getInputStyle: () => {
        return this.inputStyle;
      },
      select: this.select.bind(this),

      isSelected: this.isSelected.bind(this),

      shouldRender: (record) => {
        if (record.options.childrenVisible) return true;
        if (record?.options?.parent && !record.options.parent.childrenVisible) {
          return false;
        }
        return record.options.visible !== false && record?.children?.length > 0;
      },

      expand: (record) => {
        if (record.options.canLoad) {
          this.$emit(
            "expand",
            record,
            {
              visible: record.options.childrenVisible,
              show: () => {
                record.options.childrenVisible = true;
              },
              hide: () => {
                record.options.childrenVisible = false;
              },
            },
            this.startLoading.bind(this),
            this.stopLoading.bind(this)
          );
        } else {
          record.options.childrenVisible = !record.options.childrenVisible;
        }
      },
      emit: (eventType, item) => {
        this.$emit(eventType, item, {
          addChild: this.add.bind(this, item),
          rename: this.rename.bind(this, item),
        });
      },

      move: (...params) => {
        // TODO:
        return false;
      },

      submit: (item) => {
        this.$emit("submit", {
          ...item,
          title: item.newTitle,
        });
      },
      blur: (item) => {
        const { options, key } = item;
        const { eventType, parent } = options;
        if (eventType === "add") {
          this.map.delete(key);
          if (parent) {
            parent.children.splice(parent.children.length - 1, 1);
          } else {
            this.list.splice(this.list.length - 1, 1);
          }
        } else if (eventType === "rename") {
          item.options.edit = false;
        }
      },
      getConfirmText: () => {
        return this.confirmText;
      },
      getCancelText: () => {
        return this.cancelText;
      },
      genTitle: (title) => {
        const keyword = this.keyword;
        const titleChars = title.split("");
        const keywordChars = keyword.split("");
        const keywordSet = new Set(keywordChars);

        return titleChars
          .map((char) => {
            if (keywordSet.has(char))
              return `<span style="color:#ff4d4f">${char}</span>`;
            return char;
          })
          .join("");
      },
    };
  },
  props: {
    treeData: {
      type: Array,
      default: () => [],
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    headerLeftStyle: {
      type: Object,
      default: () => {},
    },
    lock: {
      type: Boolean,
      default: true,
    },
    delay: {
      type: Number,
      default: 500,
    },
    inputStyle: {
      type: Object,
      default: () => {},
    },
    confirmText: {
      type: String,
      default: "确定",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    tooltipText: {
      type: String,
      default: "新增",
    },
    mode: {
      type: String,
      default: "default",
    },
    showHeaderRight: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    icons() {
      const icons = this.list
        .filter((item) => item?.options?.slots?.icon)
        .map((item) => item.options.slots.icon);
      return [...new Set(icons)];
    },
  },
  components: {
    EditTreeNode,
  },
  data() {
    return {
      rawList: [],
      list: [],
      map: new Map([]),
      loading: false,
      keyword: "",
      current: null,
      currentValues: [],
      searchId: -1,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      treeDataHook: { value: [] },
    };
  },

  watch: {
    treeData: {
      handler(list) {
        this.rawList = this.list = this.genTreeData(list);
      },
      immediate: true,
      deep: true,
    },
    keyword: {
      handler(str) {
        if (!str) return (this.list = this.rawList);
        if (this.searchId) {
          clearTimeout(this.searchId);
        }

        const cb = () => {
          const deepFind = (nodes, needle = { value: false }) => {
            const parents = nodes.map((node) => {
              node = { ...node, options: { ...node.options } };
              const hit = !!node.title.toString().match(new RegExp(str, "gi"));
              node.options.hit = hit;
              needle.value = hit;
              if (Array.isArray(node.children) && node.children.length) {
                node.children = deepFind(node.children, needle);
                if (needle.value) {
                  node.options.childrenVisible = true;
                }
                if (hit) {
                  needle.value = true;
                }
              }
              if (!hit && !node.options.childrenVisible) {
                node.options.visible = false;
              }

              //过滤掉完全(从头到尾)没命中的节点
              if (!hit && !node.options.childrenVisible) {
                node.options.visible = false;
              }
              return node;
            });
            return parents;
          };

          this.list = deepFind(this.rawList);
          this.searchId = -1;
        };

        this.searchId = setTimeout(cb, this.delay);
      },
    },
    // 适配外层fetch用法
    treeDataHook: {
      handler({ value: list }) {
        this.rawList = this.list = this.genTreeData(list);
      },
      deep: true,
    },
  },
  methods: {
    _fetch() {},

    isSelected(value) {
      if (this.mode === "default") return value === this.current;
      if (this.mode === "multiple") {
        return this.currentValues.includes(value);
      }
    },
    select(record) {
      if (record?.options?.edit) return;
      if (!record?.options?.selectable) return;
      if (this.lock && this.mode === "default") {
        record = record || this.current;
      }
      if (this.mode === "default") {
        this.current = record.value;
        this.$emit("select", record.value, { current: cloneDeep(record) });
      } else if (this.mode === "multiple") {
        const value = record.value;
        if (this.currentValues.includes(value)) {
          if (this.lock && this.currentValues.length === 1) {
            //多选模式下，只选中了选择的节点，并且锁选择，并且当前正在取消当前该节点
          } else {
            this.currentValues.splice(this.currentValues.indexOf(value), 1);
          }
        } else {
          this.currentValues.push(value);
        }
        // TODO:
        this.$emit("select", this.currentValues);
      }
    },
    fetch(cb) {
      this._fetch = cb;

      cb(
        {
          pageParams: this.pageParams,
          treeData: this.treeDataHook,
          select: (value) => {
            this.$nextTick(() => {
              if (this.mode === "default") {
                if (Array.isArray(value)) {
                  throw 'when mode is "default", function "select" accept primitive type parameter';
                }
                let target;
                // 根据值去展开节点
                const recurseForExpandNode = (
                  nodes,
                  needle = { hit: false }
                ) => {
                  if (needle.hit) return;
                  for (
                    let i = 0, len = nodes.length;
                    i < len && !needle.hit;
                    i++
                  ) {
                    const node = nodes[i];
                    if (node.value === value) {
                      target = cloneDeep(node);
                      needle.hit = true;
                      if (node.options?.parent?.options) {
                        node.options.parent.options.childrenVisible = true;
                      }
                      return;
                    }
                    if (Array.isArray(node.children)) {
                      recurseForExpandNode(node.children, needle);
                      if (needle.hit) {
                        node.options.childrenVisible = true;
                      }
                    }
                  }
                };

                this.current = value;
                recurseForExpandNode(this.list);

                this.$emit("select", this.current, {
                  current: target,
                });
              } else if (this.mode === "multiple") {
                if (!Array.isArray(value)) {
                  throw 'when mode is "multiple", function "select" accept Array type parameter';
                }

                let targets = [];
                const set = new Set(value);
                const recurseForExpandNode = (
                  nodes,
                  needle = { hit: false }
                ) => {
                  if (!set.size) return;
                  for (
                    let i = 0, len = nodes.length;
                    i < len && set.size;
                    i++
                  ) {
                    const node = nodes[i];
                    if (set.has(node.value)) {
                      targets.push(cloneDeep(node));
                      needle.hit = true;
                      set.delete(node.value);
                      if (node.options?.parent?.options) {
                        node.options.parent.options.childrenVisible = true;
                      }
                    }
                    if (Array.isArray(node.children)) {
                      recurseForExpandNode(node.children);
                      if (needle.hit) {
                        node.options.childrenVisible = true;
                      }
                    }
                  }
                };
                this.currentValues = [...value];
                recurseForExpandNode(this.list);

                this.$emit("select", this.currentValues, {
                  targets,
                });
              }
            });
          },
        },
        this.startLoading.bind(this),
        this.stopLoading.bind(this)
      );
    },
    reload() {
      this.$emit("reload");
      const tem = this.keyword;
      this.keyword = "";
      this.$nextTick(() => {
        this.keyword = tem;
      });
    },
    addRoot() {
      this.$emit("addRoot", {
        addRoot: () => {
          const key = this.genKey(0, this.rawList.length);
          const node = {
            title: "",
            key,
            options: {
              edit: true,
              eventType: "add",
              parent: null,
              slots: {
                icon: void 0,
              },
            },
          };
          this.map.set(key, node);
          this.list.push(node);
          this.$nextTick(() => {
            const input = document.getElementById(`${key}`);
            input.focus();
          });
        },
      });
    },
    genKey(level, index) {
      const key = `${level}:${index}`;
      return key;
    },
    genTreeData(nodes, level = 0, parent = null) {
      if (!Array.isArray(nodes)) {
        throw `prop treeData should be array, got ${nodes}`;
      }
      return nodes.map((node, i) => {
        if (node.value === void 0) throw `节点的属性value,必选有唯一值`;
        const key = node.key || node.value || this.genKey(level, i);
        const res = {
          title: node.title || node.name || node.label,
          // 用于暂存改动的名字
          newTitle: node.title || node.name || node.label,
          key: key,
          value: node.value,
          options: {
            childrenVisible: !!node.childrenVisible,
            edit: !!node.edit,
            rename: !!node.rename,
            parent,
            menus: node.menus || [],
            // 控制右边...的显隐
            showRight: !!node.showRight,
            slots: node.slots || {},
            // 搜索命中
            hit: !!node.hit,
            // 是否显示
            visible: node.visible === false ? false : true,
            canLoad: !!node.canLoad,
            slots: node?.slots || {},
            selectable: node.selectable === false ? false : true,
            // TODO:
            // checkable: !!node.checkable,
            // moveable: !!node.moveable
          },
        };
        if (Array.isArray(node.children)) {
          res.children = this.genTreeData(node.children, level + 1, res);
        } else res.children = [];
        this.map.set(key, node);
        return res;
      });
    },
    rename(item) {
      item.options.edit = true;
      item.options.eventType = "rename";
      item.newTitle = item.title;
      const key = item.key;
      this.$nextTick(() => {
        const input = document.getElementById(`${key}`);
        input.focus();
      });
    },
    add(item) {
      const [level] = item.key.split(":");
      const key = this.genKey(+level + 1, item.children.length);
      const node = {
        title: "",
        newTitle: "",
        key,
        options: {
          edit: true,
          eventType: "add",
          parent: item,
          slots: {
            icon: void 0,
          },
          visible: true,
        },
      };
      this.map.set(key, node);
      item.children.push(node);
      if (!item.options.childrenVisible) item.options.childrenVisible = true;
      this.$nextTick(() => {
        const input = document.getElementById(`${key}`);
        input.focus();
      });
    },

    startLoading() {
      this.loading = true;
    },
    stopLoading() {
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.edit-tree {
  padding: 16px;
  .header {
    margin: 0 auto 16px;
    display: flex;
    justify-content: space-between;

    .left {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 20px;
    }
    .right {
      .icon {
        width: 16px;
        height: 16px;
        object-fit: contain;
        &.reload {
          transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
          &:focus,
          &:active {
            transform: rotate(360deg);
          }
        }
      }
      .btn {
        margin: 0 8px 0 0;
      }
    }
  }
}
</style>
