<style lang="less" scoped>
@import "../assets/main";
.actionsheet-enter-active,
.actionsheet-leave-active {
  transition: transform 0.2s;
}

.actionsheet-enter,
.actionsheet-leave-active {
  transform: translate3d(0, 50%, 0);
}

.action-sheet {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
  /*多选项的处理*/
  &.multiterm {
    .action-sheet-wrap {
      height: 370px;
      .group {
        div {
          padding-left: 14px;
          text-align: left;
        }
      }
    }
    .action-sheet-wrap185 {
      height: 185px;
    }
  }
  /*滑动银行卡的样式*/
  &.banktiterm {
    .action-sheet-wrap {
      height: 370px;
      .group {
        div {
          text-align: center;
        }
      }
    }
    .action-sheet-wrap185 {
      height: 185px;
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }
  .action-sheet-wrap {
    position: fixed;
    width: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    transition: transform 0.2s;
    transform: translate3d(0, 100%, 0);
    &.slideInUp {
      transform: translate3d(0, 0, 0);
    }
    .title {
      font-size: 13px;
      line-height: 35px;
      text-align: center;
      color: #808080;
    }
    .nav {
      border-bottom: 1px solid #e6e6e6;
      text-align: left;
      label {
        display: inline-block;
        line-height: 30px;
        padding: 0 15px;
        font-size: 15px;
        &.selected {
          border-bottom: 2px solid @tabcolor;
        }
      }
    }
    .group {
      overflow: scroll;
      width: 100%;
      div {
        line-height: 30px;
        font-size: 13px;
        text-align: center;
        display: block;
        color: #000;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        -webkit-user-select: none;
        -moz-user-focus: none;
        -moz-user-select: none;
        &.active {
          color: @tabcolor;
        }
        .actionsheet-selected {
          margin-left: 10px;
          width: 11px;
          height: 9px;
          display: inline-block;
          background: url("../assets/icon/actionsheet-selected@2X.png")
            no-repeat;
          background-size: 11px 9px;
        }
      }
    }
  }
}
</style>
<template>
  <div
    class="action-sheet"
    :class="{ multiterm: multiterm, banktiterm: isScroll }"
    v-show="show"
    @click="close"
    qg-log="关闭ActionSheet"
  >
    <div class="action-sheet">
      <div
        @click.stop
        class="qg-vbox action-sheet-wrap"
        :class="{ slideInUp: showAnimate, 'action-sheet-wrap185': height185 }"
      >
        <slot name="title">
          <div class="title">{{ title }}</div>
        </slot>
        <slot name="content">
          <div v-if="multiterm" class="nav">
            <label
              v-for="(item, index) in navTitle"
              :key="item.title"
              :class="{ selected: currentNav == index }"
              @click="navChange(index)"
            >
              {{ item.title }}
            </label>
          </div>
          <div class="group qg-flex-1">
            <div>
              <div
                @click="itemClick(index)"
                :class="{ active: selectedIndex[currentNavPage] == index }"
                v-for="(item, index) in data"
                :key="item.value"
              >
                {{ item.name }}
                <div
                  v-if="showSelected && selectedIndex[currentNavPage] == index"
                  class="actionsheet-selected"
                ></div>
              </div>
              <a v-if="isShowCancel" href="javascript:;" @click="close('close')"
                >取消</a
              >
            </div>
          </div>
        </slot>
        <slot name="footer"> </slot>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
  // import Popup from './mixin/popup';
  import $script from 'scriptjs'

  let Config = {location: `${window.location.protocol}//o7oe0d6qz.qnssl.com/static-dataaddress-json.js`};
  import BScroll from 'better-scroll'

  export default {
    // mixins: [Popup],
    data() {
      return {
        data: [],
        result: {},
        showAnimate: false,
        animateLeave: false,
        currentNav: 0,
        currentNavPage: 'proviceIndex',
        selectIndex: [],
        selectedIndex: {
          "proviceIndex": -1,
          "cityIndex": -1,
          "district": -1
        },
        navTitle: [],
        isFirst: true
      }
    },
    props: {
      // actionSheet 的标题
      title: String,
      /*
      this.actionSheet.actions = [{
        title: '导航名字',
        data: [{
          name: '条目显示的名字'
          value: '条目的值'
        }]
      }]
       */
      actions: {
        type: Array,
        default: () => []
      },
      /*
      param
        arg1 下一个导航栏目的下标
        arg2 所有选择的对象，并且以导航下标做key值
       */
      callback: Function,
      multiterm: {
        default: false
      },
      height185: {
        default: false
      },
      /*
      预先选中的数组，接受两种模式，一种是长度为1的actionsheet，接受selectedIndex:index,另一种是长度为3的地址数组，参见例子
      */
      modellist: {
        type: Array,
        default: () => []
      },
      /*
      是否开启滚动模式，适用于单选项较多的情况
      */
      isScroll: {
        default: false,
      },
      isShowCancel: {
        default: false
      },
      openCallback: Function,
      name: String,
      /*是否展示对勾*/
      showSelected: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      show() {
        if (this.modellist.length > 0 && this.isFirst) {
          this.renderExistMessage();
        }
        setTimeout(() => {
          this.showAnimate = this.show
        }, 0)
        if (this.open && this.actions.length != 0) {
          this.data = this.actions[this.currentNav].data
          if (this.multiterm || this.isScroll) {
            if (this.navTitle.length === 0) {
              this.actions.map((item) => {
                this.navTitle.push({
                  title: item.title
                })
              })
            }
          }
        }
        this.$nextTick(() => {
          this.scroll && this.scroll.refresh()
        })
        return this.open
      },
    },
    methods: {
      itemClick(index) {
        this.result[this.currentNav] = this.data[index]
        if (this.navTitle[this.currentNav]) {
          this.navTitle[this.currentNav].title = this.data[index].name
        }
        this.selectedIndex[this.currentNavPage] = index
        if (this.currentNav + 1 == this.actions.length) {
          this.selectedIndex.district = index
          if (this.multiterm) {
            this.callback(this.result, 'end')
          } else {
            this.callback(this.result[0])
          }
          this.close()
        } else {
          ++this.currentNav;
          this.currentNavPage = "cityIndex"
          if (this.currentNav == 2) {
            this.selectedIndex.cityIndex = index
            this.currentNavPage = "district"
          }
          if (this.callback) {
            this.callback(this.result, this.currentNav).then((data) => {
              if (data.length == 0) {
                this.close();
                return;
              }
              this.data = data
              this.actions[this.currentNav].data = data;
              this.$nextTick(() => {
                this.scroll && this.scroll.refresh()
              })
            })
          }
          this.data = []
        }
      },
      navChange(index) {
        if (index < this.currentNav) {
          this.navTitle.map((item, i) => {
            if (i >= index) {
              item.title = this.actions[i].title
            }
          });
          this.data = []
          this.currentNav = index
          if (index == 0) {
            this.currentNavPage = "proviceIndex"
            this.selectedIndex.cityIndex = -1
            this.selectedIndex.district = -1
          } else if (index == 1) {
            this.currentNavPage = "cityIndex"
            this.selectedIndex.district = -1
          }
          this.callback(this.result, index).then((data) => {
            this.data = data
            this.$nextTick(() => {
              this.scroll && this.scroll.refresh()
            })
          })
        }
      },
      close() {
        this.showAnimate = false;
        setTimeout(() => {
          this.$store.dispatch('closeActionSheet', this.name)
        }, 200);
      },
      renderExistMessage() {
        this.isFirst = false;
        if (this.modellist.length > 1) {
          this.currentNav = this.modellist.length - 1;
          this.currentNavPage = this.currentNav === 2 ? 'district' : 'cityIndex';
          if (this.navTitle.length == 0) {
            this.modellist.map((item, index) => {
              this.navTitle.push({title: item.name});
            })
          }
          $script(Config.location, () => {
            distrctJson.province.map((item, index) => {
              if (item.code == this.modellist[0].value) {
                this.selectIndex.push(index);
              }
            })
            distrctJson.city[this.modellist[0].value].map((item, index) => {
              if (item.code == this.modellist[1].value) {
                this.selectIndex.push(index);
              }
            })
            distrctJson.district[this.modellist[1].value].map((item, index) => {
              if (this.modellist[2] && item.code == this.modellist[2].value) {
                this.selectIndex.push(index);
              }
            })
            this.selectedIndex['proviceIndex'] = this.selectIndex[0];
            this.selectedIndex['cityIndex'] = this.selectIndex[1];
            this.selectedIndex['district'] = this.selectIndex[2];
          })
        } else if (this.modellist.length === 1) {
          this.currentNav = 0;
          this.selectedIndex['proviceIndex'] = this.modellist[0].selectItem;
        }
      }
    },
    mounted() {
      this.scroll = new BScroll('.group', {
        scrollY: true,
        click: true
      })
    }
  }
</script>
