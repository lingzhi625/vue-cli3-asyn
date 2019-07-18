<template>
  <transition name="qg-zoom">
    <div class="qg-modal" v-show="open">
      <div class="qg-modal-header" v-if="title" @touchmove="prevent($event)">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div class="qg-modal-body">
        <slot name="body"> </slot>
      </div>
      <div class="qg-modal-footer" v-if="button" @touchmove="prevent($event)">
        <slot name="footer">
          <div class="qg-box">
            <div
              @click="handleCancel"
              class="qg-modal-footer-cancel qg-flex-1"
              v-if="button.length > 1"
              qg-log="modal取消"
            >
              {{ button[1].text }}
            </div>
            <div
              @click="handleConfirm"
              class="qg-modal-footer-confirm qg-flex-1"
              qg-log="modal确认"
            >
              {{ button[0].text }}
            </div>
          </div>
        </slot>
      </div>
    </div>
  </transition>
</template>
<script>
/**
 * qg-modal
 * @module components/modal
 * @desc 模态框
 * @param {array}[button] -按钮数组，第一个为确定，第二个为取消，
 * @param {array}[button][0] -{text:确定,func:事件}
 * @param {slot} [title] - 头部
 * @param {slot} [body] - 正文
 * @param {slot} [footer] - 底部按钮
 * @desc overlay遮盖层
 * @param {boolean}[open] 是否打开modal
 * @param {boolean}[overlay] 是否打开overlay
 * @param {Number}[overlayOpacity] overlay透明度
 * @param {String}[overlayColor] overlay颜色
 *
 * overlay zindex 99
 *
 * @example
 * <qg-modal>头部</qg-modal>
 */
// import Popup from "./mixin/popup";
export default {
  // mixins: [Popup],
  props: {
    button: {
      type: Array
    },
    name: String,
    title: String,
    open: Boolean
  },
  methods: {
    close() {
      this.$store.dispatch("closeModal", this.name);
    },
    overlayClick() {
      this.close();
    },
    prevent(event) {
      event.preventDefault();
      event.stopPropagation();
    },
    handleConfirm() {
      this.close();
      this.button[0].func && this.button[0].func();
      this.$emit("confirm");
    },
    handleCancel() {
      this.close();
      this.button[1].func && this.button[1].func();
      this.$emit("cancel");
    }
  }
};
</script>
<style lang="less" scoped>
@import "../assets/main";
.qg-modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 290px;
  margin: 0 auto;
  padding: 0;
  background-color: #ffffff;
  border-radius: @modal-default-border-radius;
  font-size: 16px;
  z-index: @modal-default-zindex;
  text-align: center;
  .qg-modal-header {
    font-size: 18px;
    padding: 20px 18px;
    line-height: 25px;
    color: @mainfont;
  }
  .qg-modal-body {
    text-align: left;
    font-size: 15px;
    color: @greycolor;
    line-height: 20px;
    padding: 0 15px 20px 15px;
  }
  .qg-modal-footer {
    border-top: @modal-default-footer-border;
    height: @modal-default-footer-height;
    line-height: @modal-default-footer-height;
    .qg-modal-footer-cancel {
      color: @mainfont;
      border-right: @modal-default-footer-border;
      &:active {
        background-color: @item-selected-color;
      }
    }
    .qg-modal-footer-confirm {
      color: @tabcolor;
      &:active {
        background-color: @item-selected-color;
      }
    }
  }
}

@keyframes zoomOut {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
    transform-origin: 0% 0%;
    -webkit-transform: scale3d(0.3, 0.3, 0.3);
    transform: scale3d(0.3, 0.3, 0.3);
  }
  to {
    opacity: 0;
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform-origin: 0% 0%;
    -webkit-transform: scale3d(0.3, 0.3, 0.3);
    transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
    opacity: 1;
  }
}

.qg-zoom-enter-active {
  animation: zoomIn 0.2s;
  transform-origin: 0 0;
}

.qg-zoom-leave-active {
  animation: zoomOut 0.2s;
  transform-origin: 0 0;
}
</style>
