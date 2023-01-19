<template>
  <div class="search-form-con" ref="con" id="search-form">
    <div
      :style="{
        paddingRight: rightWidth + 'px',
      }"
      :class="[visible && 'show', 'wrap']"
      ref="wrap"
    >
      <slot></slot>
    </div>

    <div class="mask">
      <template v-if="showTrigger">
        <a class="link" href="javascript:;" @click="toggle">{{
          visible ? "折叠" : "展开"
        }}</a>
        <a-divider type="vertical" />
      </template>
      <a class="link" href="javascript:;" @click="reset">重置</a>
    </div>
  </div>
</template>
<script>
export default {
  name: "SearchForm",
  props: {
    rightWidth: {
      type: Number,
      default: 100,
    },
  },

  provide() {
    return {
      submit: this.submit,
    };
  },
  data() {
    return {
      // 是否需要 展开/折叠按钮
      showTrigger: false,
      // 是否隐藏
      visible: false,

      // 缓存控件的值
      values: {},
      cols: 0,
      id: void 0,
    };
  },
  watch: {
    // for animation
    visible: {
      handler(val) {
        this.$nextTick(() => {
          const { length } = this.getVnodes();
          const rows = Math.ceil(length / this.cols);
          const height = rows * 34 + (rows - 1) * 16 + "px";
          const wrapElm = this.$refs.wrap;

          if (!val) {
            wrapElm.style.maxHeight = "34px";
            setTimeout(() => {
              wrapElm.style.height = "34px";
            }, 200);
            return;
          }
          // 计算能放多少行
          wrapElm.style.height = height;
          wrapElm.style.maxHeight = "1000px";

          setTimeout(() => {
            // 处理动态加入子项, 高度不能写死
            wrapElm.style.height = "auto";
          }, 200);
        });
      },
    },
  },

  methods: {
    submit(params = {}) {
      this.$emit("submit", Object.assign(this.values, params));
    },
    toggle() {
      this.visible = !this.visible;
    },
    reset() {
      const vnodes = this.getVnodes();
      if (!vnodes) return;
      vnodes.forEach((vnode) => {
        vnode?.componentInstance?.reset();
      });
      for (let k in this.values) {
        this.values[k] = void 0;
      }
      this.$emit("reset", this.values);
    },
    getVnodes() {
      return this.$slots?.default || [];
    },
    doCalc() {
      let { width } = this.$refs.wrap.getBoundingClientRect();
      width -= 100; //减去右边内边距
      const vnodes = this.getVnodes();
      let sum = 0;
      let col = 0;
      for (let i in vnodes) {
        const vnode = vnodes[i];
        sum +=
          (vnode.componentOptions?.propsData?.width || 216) +
          (+i === vnodes.length - 1 ? 0 : 24);
        // 需要换行展示，show toggle 按钮
        if (sum >= width) {
          this.showTrigger = true;
          // 记录能放多少列
          this.cols = col;
          return;
        } else {
          col++;
        }
      }
      this.showTrigger = false;
    },
  },

  mounted() {
    // nexttick监听不到子组件的挂载
    setTimeout(this.doCalc);
    // 处理窗口大小变化的场景
    window.addEventListener("resize", () => {
      if (this.id) clearTimeout(this.id);
      this.id = setTimeout(() => {
        this.doCalc();
        this.id = void 0;
      },50);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.doCalc);
  },
};
</script>

<style lang="less" scoped>
.search-form-con {
  position: relative;
  padding: 24px;
  background-color: #fff;
  border-radius: 4px;

  .wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 24px;
    max-height: 34px;
    height: 34px;
    overflow-y: hidden;
    overflow-x: auto;
    transition: all 0.2s cubic-bezier(0, 1, 0.5, 1);
  }

  .mask {
    white-space: nowrap;
    position: absolute;
    right: 24px;
    bottom: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
    .link {
      color: rgba(0, 0, 0, 0.85);
    }
  }
}
</style>
