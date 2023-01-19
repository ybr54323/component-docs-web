<template>
  <div id="edit-tree-nodes">
    <draggable
      v-model="treeData"
      :group="{
        name: 'group',
      }"
      :move="move"
    >
      <div class="item" v-for="(item, i) in treeData" :key="item.key">
        <div
          v-if="item.options.visible !== false"
          :class="[
            isSelected(item.value) && 'current',
            item.options.edit && 'fat',
            'row',
          ]"
          :style="{
            paddingLeft: level * 16 + 6 + 'px',
          }"
          @mouseenter.self="mouseenter(item)"
          @mouseleave.self="mouseleave(item)"
          @click.self.stop="select(item)"
        >
          <div
            v-if="!item.options.edit"
            class="g-flex g-align-center"
            @click="select(item)"
          >
            <!-- arrow -->
            <node-arrow
              v-if="hasChildren(item) || item.options.canLoad"
              class="g-mr-8"
              :visible="item.options.childrenVisible"
              @click.native.stop="expand(item)"
            ></node-arrow>
            <div v-else class="g-mr-8 placeholder"></div>
            <!-- icon -->
            <slot :name="item.options.slots.icon">
              <img class="icon g-mr-8" src="./imgs/file.png" alt="icon" />
            </slot>
            <!-- title label -->
            <span class="title-wrap" v-html="genTitle(item.title)"> </span>
          </div>

          <template v-else>
            <div class="g-mr-8 placeholder"></div>
            <a-input
              :id="item.key"
              :key="item.key"
              class="input"
              :style="getInputStyle()"
              :defaultValue="item.title"
              v-model="item.newTitle"
              @keydown.enter="submit(item)"
            >
              <div slot="suffix">
                <a
                  class="g-mr-8"
                  @click.stop="submit(item)"
                  href="javascript:;"
                  >{{ getConfirmText() }}</a
                >
                <a @click.stop="blur(item)" href="javascript:;">{{
                  getCancelText()
                }}</a>
              </div>
            </a-input>
          </template>

          <slot name="nodeRight" :record="item" :index="i">
            <span
              v-if="!item.options.edit && item.options.menus.length"
              :class="[
                !item.options.edit && item.options.showRight && 'show',
                'right',
              ]"
            >
              <a-dropdown>
                <span
                  class="icon-wrap g-flex g-justify-center g-align-center"
                  ref="iconWrap"
                >
                  <img class="icon" src="./imgs/ellipsis.png" alt="icon" />
                </span>

                <a-menu
                  slot="overlay"
                  @mouseenter.self="mouseenter(item)"
                  @mouseleave.self="mouseleave(item)"
                >
                  <a-menu-item v-for="(menu, i) in item.options.menus" :key="i">
                    <a
                      href="javascript:;"
                      @click="emit(menu.eventType, item)"
                      >{{ menu.title }}</a
                    >
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
          </slot>
        </div>

        <edit-tree-node
          v-if="shouldRender(item)"
          :class="[
            item.options.childrenVisible && hasChildren(item) ? 'show' : 'hide',
            'children',
          ]"
          :treeData="item.children"
          :level="level + 1"
        >
          <template slot="nodeRight" slot-scope="{ record, index }">
            <slot name="nodeRight" :record="record" :index="index"></slot>
          </template>
          <template :slot="item.options.slots.icon">
            <slot :name="item.options.slots.icon"></slot>
          </template>
        </edit-tree-node>
      </div>
    </draggable>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import Vue from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import NodeArrow from "./components/arrow.vue";

Vue.use(Antd);
export default {
  name: "EditTreeNode",
  inject: [
    "move",
    "submit",
    "emit",
    "expand",
    "blur",
    "select",
    "isSelected",
    "getInputStyle",
    "getConfirmText",
    "getCancelText",
    "genTitle",
    "shouldRender",
  ],
  props: {
    treeData: {
      type: Array,
      default: () => [],
    },
    level: {
      type: Number,
      default: 0,
    },
  },
  components: {
    Draggable,
    NodeArrow,
  },
  data() {
    return {};
  },

  methods: {
    hasChildren(item) {
      return item.isLeaf || item?.children?.length;
    },

    mouseenter(item) {
      if (item.options.id) {
        clearTimeout(item.options.id);
      }
      item.options.showRight = true;
    },
    mouseleave(item) {
      item.options.id = setTimeout(() => {
        item.options.showRight = false;
      }, 200);
    },
  },
};
</script>

<style lang="less" scoped>
@import "./style/index.less";
</style>
