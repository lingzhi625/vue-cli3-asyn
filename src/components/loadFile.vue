<template>
  <div>
    <form>
      <input
        class="form-warp"
        type="file"
        accept="image/*"
        @change="imgChange($event)"
        @click="appclick($event)"
      />
    </form>
    <div v-if="showCanvas"></div>
    <canvas v-show="false" id="canvas"></canvas>
  </div>
</template>

<script>
// import dataService from "../service/static-data.service";

export default {
  props: {
    isFront: {
      type: String,
      default: ""
    },
    isApp: Boolean
  },
  data() {
    return {
      showCanvas: true
    };
  },
  methods: {
    imgChange(e) {
      let input = e.target.files;
      if (input && input[0] && input[0].type.indexOf("image") > -1) {
        this.$emit("changeinput");
        this.resizeImg(e.target);
      } else {
        this.$emit("changeinput", "not image");
      }
    },
    appclick(e) {
      if (this.isApp) {
        if (window.xyqbNative && window.xyqbNative.openfaceIDIDCard) {
          window.xyqbNative.openfaceIDIDCard({
            isShootPagePortrait: this.isFront === "1" //身份证正面true false是反
          });
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            window.event.returnValue == false;
          }
          return false;
        }
      }
    },
    resizeImg(input) {
      //        let fileType = input.files[0].type;
      /* eslint-disable */
      console.log("image input", input)
        let reader = new FileReader();
        reader.onload = (e) => {
          let image = new Image()
          image.src = e.target.result
          image.onload = () => {
            let canvas = document.getElementById('canvas')
            canvas.width = 760
            canvas.height = 480
            let ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
            let newImageData = canvas.toDataURL('image/jpeg', 0.9)
            let sendData = newImageData.replace("data:image/jpeg;base64,", '')
            this.showCanvas = false
            setTimeout(() => {
              this.showCanvas = true
            }, 200)
            this.$emit('resizeend', {sendData: sendData, str: this.isFront === '1' ? 'front': 'back'})
          }

        }
        reader.readAsDataURL(input.files[0]);
        /* eslint-enable */
    }
  }
};
</script>

<style lang="less" scoped>
.form-warp {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  opacity: 0;
  & > div {
    width: 100%;
    height: 100%;
  }
}
</style>
