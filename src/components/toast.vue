<style lang="less" scoped>
.alertify {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  width: 100%;
  height: 100%;
  &.show {
    .inner {
      opacity: 1;
      -webkit-transform: scale(1);
      -o-transform: scale(1);
      -moz-transform: scale(1);
      transform: scale(1);
    }
  }
  ._inner {
    position: absolute;
    top: 50%;
    left: 0;
    -webkit-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
    &.top {
      top: 30%;
    }
    &.bottom {
      top: 70%;
    }
  }
  .inner {
    padding: 7px 25px;
    background: rgba(0, 0, 0, 0.4);
    display: inline-block;
    color: #fff;
    font-size: 14px;
    border-radius: 5px;
    opacity: 0;
    max-width: 75%;
    -ms-word-wrap: break-word;
    word-wrap: break-word;
    -ms-word-break: break-all;
    word-break: break-all;

    @transition: all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);

    -webkit-transition: @transition;
    -moz-transition: @transition;
    -o-transition: @transition;
    transition: @transition; /* custom */

    -webkit-transform: scale(0.01);
    -o-transform: scale(0.01);
    -moz-transform: scale(0.01);
    transform: scale(0.01);
  }
}
</style>
<template>
  <div>
    <div v-show="show" class="alertify" @click="close" :class="{ show: open }">
      <div class="_inner" :class="position">
        <div class="inner" :style="styleObject">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let time = null;
export default {
  props: {
    name: String,
    open: {
      type: Boolean,
      default: false
    },
    message: {
      type: String
    },
    duration: {
      type: Number,
      default: 2000
    },
    styleObject: Object,
    position: String //目前只接受top bottom 默认middle
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$store.dispatch("closeToast", this.name);
      clearTimeout(time);
    }
  },
  computed: {
    show() {
      /* eslint-disable */
      if (this.open) {
        time = setTimeout(() => {
          this.close();
        }, this.duration);
      }
      return this.open;
    }
  },
  mounted() {}
};
</script>
