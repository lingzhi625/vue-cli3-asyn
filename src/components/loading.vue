<template>
  <div class="wait-loading-wrapper">
    <div class="wait-loading qg-cbox">
      <div class="wait qg-cbox"><span></span><span></span><span></span></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "loading",
  data() {
    return {};
  },
  methods: {},
  computed: {},
  mounted() {}
};
</script>
<style lang="less" scoped>
@import "../assets/main";

.wait-loading-wrapper {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  z-index: 99;
  .wait-loading {
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -35px 0 0 -35px;
    text-align: center;
    background-color: #000000;
    opacity: 0.5;
    width: 69px;
    height: 69px;
    border-radius: 4px;
    .wait {
      & > span {
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ffffff;
        animation: waitloading 1.2s infinite ease-in-out;
      }
      & > span:nth-child(1) {
        margin-right: 8px;
        animation-delay: 0.3s;
        -webkit-animation-delay: 0.3s;
      }
      & > span:nth-child(2) {
        margin-right: 8px;
        animation-delay: 0.6s;
        -webkit-animation-delay: 0.6s;
      }
      & > span:nth-child(3) {
        animation-delay: 0.9s;
        -webkit-animation-delay: 0.9s;
      }
    }
    @keyframes waitloading {
      from {
        opacity: 0.4;
      }
      to {
        opacity: 1;
      }
    }
    @-webkit-keyframes waitloading {
      from {
        opacity: 0.4;
      }
      to {
        opacity: 1;
      }
    }
  }
}
</style>
