<template>
  <i class="g-flex g-align-center g-justify-center icon-wrap"
    ><svg
      :class="[visible && 'active']"
      viewBox="0 0 1024 1024"
      width="1em"
      height="1em"
      fill="rgba(0,0,0,0.85)"
      focusable="false"
    >
      <path
        d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
      ></path></svg
  ></i>
</template>

<script>
export default {
  name: "NodeArrow",
  props: {
    visible: {
      type: Boolean,
    },
  },
  methods: {
    open() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    trigger() {
      this.visible = !this.visible;
      this.$emit("trigger", this.visible);
    },
  },
};
</script>
<style lang="less" scoped>
i {
  font-size: 12px;
  transition: all 0.2s;

  svg {
    transform: rotate(-90deg);
    transition: all 0.2s;
    &.active {
      transform: rotate(0);
    }
  }
}
</style>
