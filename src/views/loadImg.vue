<template>
  <div>
    <h6 class="maintip">
      {{
        notdone ? "拍摄您的二代身份证" : "请核对自动识别结果，如有误请重新拍摄"
      }}
    </h6>
    <div>
      <div class="notshoot" v-show="!front.shoot">
        <div>
          <img src="../assets/image/idCamera.png" alt="" />
          <p>点击拍摄人面像</p>
          <upFile
            v-show="front.again"
            isFront="1"
            @changeinput="imgChange1"
            @resizeend="resizeEnd"
          ></upFile>
        </div>
      </div>
      <div class="shoot" v-show="front.shoot">
        <div>
          <div class="idleft">
            <upFile
              v-show="front.again"
              isFront="1"
              @changeinput="imgChange1"
              @resizeend="resizeEnd"
            ></upFile
            ><img :src="front.src" alt="" /><b></b>
          </div>
          <div class="idright">
            <b>姓名</b>
            <p>{{ frontInfo.name }}</p>
            <b>身份证</b>
            <p>
              {{ frontInfo.citizen_id }}
              <span class="vertical"
                ><upFile
                  v-show="front.again"
                  isFront="1"
                  @changeinput="imgChange1"
                  @resizeend="resizeEnd"
                ></upFile
              ></span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="notshoot back" v-show="!back.shoot">
        <div>
          <img src="../assets/image/idCamera.png" alt="" />
          <p>点击拍摄国徽面</p>
          <upFile
            v-show="back.again"
            isFront="0"
            @changeinput="imgChange1"
            @resizeend="resizeEnd"
          ></upFile>
        </div>
      </div>
      <div class="shoot" v-show="back.shoot">
        <div>
          <div class="idleft">
            <upFile
              v-show="back.again"
              isFront="0"
              @changeinput="imgChange2"
              @resizeend="resizeEnd"
            ></upFile
            ><img :src="back.src" alt="" /><b></b>
          </div>
          <div class="idright">
            <b>签证机关</b>
            <p>{{ backInfo.agency }}</p>
            <b>有效期限</b>
            <p>
              {{
                backInfo.valid_date_begin.replace(
                  /(\d{4})(\d{2})(\d{2})/,
                  "$1.$2.$3"
                )
              }}-{{
                backInfo.valid_date_end.replace(
                  /(\d{4})(\d{2})(\d{2})/,
                  "$1.$2.$3"
                )
              }}<span class="vertical"
                ><upFile
                  v-show="back.again"
                  isFront="0"
                  @changeinput="imgChange2"
                  @resizeend="resizeEnd"
                ></upFile
              ></span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <button class="redButton" :class="{ grey: notdone }" @click="confirm">
      提交
    </button>
    <p class="foottip">仅用于全国公民身份查询中心核实身份</p>
    <div class="goodmodal" v-show="openModal">
      <div class="text-center">
        <p class="pt-20">身份证信息有误将影响授信，请确认</p>
        <p class="fontw mt-10">{{ frontInfo.name }}</p>
        <p class="fontw mt-5">{{ frontInfo.citizen_id }}</p>
        <div>
          <b @click="cancelback">返回修改</b
          ><b class="fontred" @click="submit"
            >确认无误<i>({{ count }}s)</i></b
          ><span></span>
        </div>
      </div>
    </div>
    <!-- <Modal :open="idopen" name="idmodal" title="证件上传示例" :button="button">
      <div slot="body" class="tipsmodal">
        <img src="../assets/image/idTips.png" alt="" />
      </div>
    </Modal> -->
    <Toast
      name="ocrtoast"
      :open="ocropen"
      :message="message"
      position="top"
    ></Toast>
  </div>
</template>
<script>
import Toast from "../components/toast.vue";
// import Modal from "../components/modal.vue";
import upFile from "../components/loadFile.vue";
// import ocrApi from "../../api/ocr.api";
// import userApi from "../../api/user.api";
// import { getActive } from "../../service/authUrl";
import { mapState } from "vuex";
//import localStorage from "../../service/localStorage.service";
import sa from "sa-sdk-javascript";
let timer = null,
  timer1 = null;
export default {
  name: "setTradePassword",
  data() {
    return {
      tips: "拍摄您的二代身份证",
      front: {
        shoot: false,
        again: true,
        src: ""
      },
      back: {
        shoot: false,
        again: true,
        src: ""
      },
      openModal: false,
      message: "请选择图片",
      count: 5,
      frontInfo: {
        name: "",
        citizen_id: ""
      },
      backInfo: {
        valid_date_begin: "",
        valid_date_end: ""
      },
      button: [{ text: "知道了" }]
    };
  },
  mounted() {
    this.$store.dispatch("openModal", "idmodal");
    document
      .getElementById("app")
      .setAttribute("style", "background-color:#f7f7f7;");
    let appdata = "";
    this.$store.dispatch("openLoading");
    // ocrApi.queryOcr().then(res => {
    //   let _data = res.data;
    //   this.$store.dispatch("closeLoading");
    //   if (res.business_code === 0 && _data && _data.length > 0) {
    //     _data.forEach(ele => {
    //       if (ele.side === "front") {
    //         this.front.shoot = !!ele.citizen_id;
    //         this.front.src = "data:image/jpeg;base64," + ele.img_base64;
    //         this.frontInfo = ele;
    //       }
    //       if (ele.side === "back") {
    //         this.back.shoot = !!ele.agency;
    //         this.back.src = "data:image/jpeg;base64," + ele.img_base64;
    //         this.backInfo = ele;
    //       }
    //     });
    //   }
    // });
    window.xyqbNativeEvent = json => {
      if (json.event === "faceIDIDCardCallBack") {
        appdata = json.data || {};
        this.perception(appdata.base64Str, appdata.isShootPagePortrait ? 1 : 2);
      }
    };
  },
  beforeDestroy() {
    document.getElementById("app").removeAttribute("style");
  },
  computed: {
    ...mapState({
      idopen: state => state.qg.modal.idmodal,
      ocropen: state => state.qg.toast.ocrtoast
    }),
    notdone() {
      return !(this.front.shoot && this.back.shoot);
    }
  },
  methods: {
    confirm() {
      if (this.notdone) {
        return;
      }
      this.openModal = true;
      let vm = this;
      this.count = 5;
      timer1 = setInterval(function() {
        if (vm.count <= 1) {
          vm.submit();
        }
        vm.count--;
      }, 1000);
    },
    cancelback() {
      this.openModal = false;
      clearInterval(timer1);
    },
    submit() {
      this.openModal = false;
      clearInterval(timer1);
      if (!this.frontInfo.name) {
        this.message = "请上传身份证照片";
        this.$store.dispatch("openToast", "ocrtoast");
        return;
      }
      this.$store.dispatch("openLoading");
      let num = 0;
      let that = this;
      //ocr认证接口
      // ocrApi
      //   .submitOcr(this.frontInfo.name, this.frontInfo.citizen_id)
      //   .then(res => {
      //     if (res.business_code === 0) {
      //       num++;
      //       tonext(num);
      //     } else {
      //       that.message = "图片上传失败，请重试！";
      //       that.$store.dispatch("openToast", "ocrtoast");
      //     }
      //   });
      //用户实名认证接口
      // userApi
      //   .setIdCard({
      //     name: this.frontInfo.name,
      //     idNo: this.frontInfo.citizen_id
      //   })
      //   .then(() => {
      //     this.$store.dispatch("closeLoading");
      //     num++;
      //     tonext(num);
      //   });
      function tonext(num) {
        if (num >= 2) {
          sa.track("OcrSuccess", {}); // ocr成功埋点
          that.message = "身份认证成功！";
          that.$store.dispatch("openToast", "ocrtoast");
          // getActive();
        }
      }
      tonext(1)
    },
    imgChange1(err) {
      if (err) {
        this.front.again = false;
        this.message = "请选择图片";
        this.$store.dispatch("openToast", "ocrtoast");
        setTimeout(() => {
          this.front.again = true;
        }, 10);
        return;
      }
      timer = setTimeout(() => {
        this.$store.dispatch("openLoading");
      }, 200);
    },
    imgChange2(err) {
      if (err) {
        this.back.again = false;
        this.message = "请选择图片";
        this.$store.dispatch("openToast", "ocrtoast");
        setTimeout(() => {
          this.back.again = true;
        }, 10);
        return;
      }
      timer = setTimeout(() => {
        this.$store.dispatch("openLoading");
      }, 200);
    },
    resizeEnd(data) {
      console.log("resizeEnd1-data", data)
      this[data.str].again = false;
      clearTimeout(timer);
      this.$store.dispatch("closeLoading");
      this[data.str].src = "data:image/jpeg;base64," + data.sendData;
      setTimeout(() => {
        this[data.str].again = true;
      }, 10);
      // this.perception(data, 1);
      this.perception(data.sendData, data.str);
    },
    perception(sendData, str) {
      console.log("perception-sendData", sendData)
      let imgSrc = "data:image/jpeg;base64," + sendData;
      if(str === 'front') {
        this.front.shoot = true;
        this.front.src = imgSrc;
      }
      if(str === 'back') {
        this.back.shoot = true;
        this.back.src = imgSrc;
      }
      // this.frontInfo = idInfo;
      // ocrApi.ocrUpLoad(sendData).then(res => {
      //   if (res.business_code === 0 && res.code === 0) {
      //     let idInfo = res.data;
      //     let imgScr = "data:image/jpeg;base64," + idInfo.img_base64;
      //     if (idInfo.side === "front") {
      //       this.front.shoot = true;
      //       this.front.src = imgScr;
      //       this.frontInfo = idInfo;
      //     }
      //     if (idInfo.side === "back") {
      //       this.back.shoot = true;
      //       this.back.src = imgScr;
      //       this.backInfo = idInfo;
      //     }
      //   } else {
      //     this.message = "图片上传失败";
      //     this.$store.dispatch("openToast", "ocrtoast");
      //   }
      //   this.front.again = true;
      //   this.back.again = true;
      // });
    }
  },
  components: {
    Toast,
    // Modal,
    upFile
  }
};
</script>
<style lang="less" scoped>
@greycolor: #333;
.maintip {
  font-size: 14px;
  text-align: center;
  padding: 20px 0;
}
.redButton {
  margin-top: 30px;
  /*position: absolute;
  bottom: 70px;
  left: 5%;*/
}
.foottip {
  width: 100%;
  font-size: 11px;
  text-align: center;
  color: #666;
  position: absolute;
  bottom: 20px;
}
.notshoot {
  padding-bottom: 19px;
  & > div {
    width: 220px;
    height: 121px;
    margin: 0 auto;
    background: url("../assets/image/idFront.png") no-repeat;
    background-size: 100%;
    text-align: center;
    padding-top: 20px;
    position: relative;
  }
  img {
    width: 65px;
    height: 65px;
  }
  p {
    text-align: center;
    margin-top: 5px;
    font-size: 15px;
  }
  &.back {
    padding-top: 19px;
    padding-bottom: 0;
    div {
      background: url("../assets/image/idBack.png") no-repeat;
      background-size: 100%;
    }
  }
}
.shoot {
  background-color: #fff;
  padding: 0 25px;
  & > div {
    border-bottom: 1px solid #f7f7f7;
    padding: 25px 0 20px 0;
    overflow: hidden;
  }
  .idleft {
    width: 100px;
    height: 64px;
    background: url("../assets/image/idBackimg.png") no-repeat;
    background-size: 100%;
    float: left;
    position: relative;
    padding-top: 5px;
    img {
      display: block;
      margin: 0 auto;
      width: 92px;
      height: 59px;
    }
    b {
      position: absolute;
      width: 34px;
      height: 34px;
      left: 50%;
      margin-left: -17px;
      top: 50%;
      margin-top: -17px;
      background: url("../assets/image/greyCamera.png") no-repeat;
      background-size: 100%;
    }
  }
  .idright {
    width: 62%;
    float: right;
    b {
      display: block;
      color: @greycolor;
      font-size: 12px;
    }
    p {
      font-size: 15px;
      padding: 5px 0;
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        width: 18px;
        height: 14px;
        background: url("../assets/image/smallCamera.png") no-repeat;
        background-size: 100%;
        right: 0;
      }
    }
  }
}
.goodmodal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  .fontw {
    font-weight: bold;
    font-size: 18px;
  }
  & > div {
    width: 78%;
    height: 200px;
    margin: 0 auto;
    margin-top: 50%;
    background-color: #fff;
    border-radius: 6px;
    position: relative;
    text-align: center;
    .pt-20 {
      padding-top: 30px;
      font-size: 15px;
      color: @greycolor;
    }
    .mt-10 {
      margin-top: 10px;
    }
    .mt-5 {
      margin-top: 5px;
    }
    div {
      position: absolute;
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      bottom: 0;
      left: 0;
      border-top: 1px solid #ddd;
      b {
        font-weight: normal;
        font-size: 18px;
        width: 50%;
        float: left;
        &.fontred {
          color: #b44b4d;
        }
        i {
          font-style: normal;
          color: #999;
          font-size: 12px;
        }
      }
      span {
        height: 50px;
        width: 1px;
        position: absolute;
        top: 0;
        left: 50%;
        background-color: #ddd;
      }
    }
  }
}
.tipsmodal {
  text-align: center;
  img {
    width: 90%;
  }
}
</style>
