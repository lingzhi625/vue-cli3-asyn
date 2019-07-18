<template>
  <div>
    <!-- <loading></loading> -->
    <toast :open="open" message="hello toast" name="toast1"></toast>
    <div>
      <span>点击上传文件</span>
      <!-- <loadFile :isApp="false"></loadFile> -->
    </div>
    
    <modal :open="modal"  name="modal1" title="modal title"></modal>
    <button @click="showtoast()">open toast</button>
    <button @click="showloadFile()">open loadFile</button>
    <button @click="showmodal()">open modal</button>


  </div>
</template>
<script>
// import actionSheet from '../components/actionSheet'

// import loading from '../components/loading'
import modal from '../components/modal'
import toast from '../components/toast'
export default {
    data () {
        return {
          open: false,
          loadFile: false,
          modal: false
        }
    },
    components: {
        // actionSheet,
        // loadFile,
        // loading,
        modal,
        toast
    },
    methods: {
      showtoast() {
        this.open = true
        this.$store.dispatch("openToast", "toast1");
      },
      showloadFile() {
        console.log("showloadFile")
        this.loadFile = true
      },
      showmodal() {
        console.log("showmodal")
        this.modal = true
      }
    }
}
</script>

