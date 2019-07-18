import Vue from "vue";
import Vuex from "vuex";
import qg from "./module";

Vue.use(Vuex);
// let modules = { ...qg };

let store = new Vuex.Store({
  modules: {
    qg: qg
  }
});

export default store;
