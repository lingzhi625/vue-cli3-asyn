import * as types from "./type";
import Vue from "vue";

export default {
  state: {
    actionSheet: {
      open: false
    },
    picker: {
      open: false
    },
    loading: {
      open: false
    },
    modal: {
      open: false
    },
    toast: {
      open: false
    },
    notice: {
      open: false
    },
    header: true,
    title: "享花卡"
  },
  mutations: {
    [types.CHANGE_HEADER](state, header) {
      if (header !== undefined) {
        state.header = header;
      }
    },
    [types.CHANGE_TITLE](state, title) {
      if (title) {
        state.title = title;
      }
      document.title = state.title;
    },
    //关闭actionsheet，接收name参数,默认open
    [types.CLOSE_ACTIONSHEET](state, name) {
      name
        ? Vue.delete(state.actionSheet, name)
        : (state.actionSheet.open = false);
    },
    //打开actionsheet，接收name参数
    [types.OPEN_ACTIONSHEET](state, name) {
      name
        ? Vue.set(state.actionSheet, name, true)
        : (state.actionSheet.open = true);
    },
    //关闭picker，接收name参数,默认open
    [types.CLOSE_PICKER](state, name) {
      name ? Vue.delete(state.picker, name) : (state.picker.open = false);
    },
    //打开picker，接收name参数
    [types.OPEN_PICKER](state, name) {
      name ? Vue.set(state.picker, name, true) : (state.picker.open = true);
    },
    //关闭modal，接收name参数
    [types.CLOSE_MODAL](state, name) {
      name ? Vue.delete(state.modal, name) : (state.modal.open = false);
    },
    //打开modal，接收name参数
    [types.OPEN_MODAL](state, name) {
      name ? Vue.set(state.modal, name, true) : (state.modal.open = true);
    },
    //关闭toast，接收name参数
    [types.CLOSE_TOAST](state, name) {
      name ? Vue.delete(state.toast, name) : (state.toast.open = false);
    },
    //打开toast，接收name参数
    [types.OPEN_TOAST](state, name) {
      name ? Vue.set(state.toast, name, true) : (state.toast.open = true);
    },
    //全局打开toast
    [types.OPEN_NOTICEBAR_ALL](state, object) {
      object.name
        ? Vue.set(state.notice, object.name, true)
        : (state.notice.open = true);
      state.notice.message = object.message || "";
    },
    //关闭noticebar，接收name参数
    [types.CLOSE_NOTICEBAR](state, name) {
      name ? Vue.delete(state.notice, name) : (state.notice.open = false);
    },
    //打开noticebar，接收name参数
    [types.OPEN_NOTICEBAR](state, name) {
      name ? Vue.set(state.notice, name, true) : (state.notice.open = true);
    },
    [types.OPEN_LOADING](state) {
      state.loading.open = true;
    },
    [types.CLOSE_LOADING](state) {
      state.loading.open = false;
    }
  },
  actions: {
    closeActionSheet({ commit }, name) {
      commit(types.CLOSE_ACTIONSHEET, name);
    },
    openActionSheet({ commit }, name) {
      commit(types.OPEN_ACTIONSHEET, name);
    },
    closePicker({ commit }, name) {
      commit(types.CLOSE_PICKER, name);
    },
    openPicker({ commit }, name) {
      commit(types.OPEN_PICKER, name);
    },
    closeModal({ commit }, name) {
      commit(types.CLOSE_MODAL, name);
    },
    openModal({ commit }, name) {
      commit(types.OPEN_MODAL, name);
    },
    closeToast({ commit }, name) {
      commit(types.CLOSE_TOAST, name);
    },
    openToast({ commit }, payload) {
      commit(types.OPEN_TOAST, payload);
    },
    closeNoticeBar({ commit }, name) {
      commit(types.CLOSE_NOTICEBAR, name);
    },
    openNoticeBar({ commit }, name) {
      commit(types.OPEN_NOTICEBAR, name);
    },
    changeHeader({ commit }, header) {
      commit(types.CHANGE_HEADER, header);
    },
    changeTitle({ commit }, title) {
      commit(types.CHANGE_TITLE, title);
    },
    closeLoading({ commit }) {
      commit(types.CLOSE_LOADING);
    },
    openLoading({ commit }) {
      commit(types.OPEN_LOADING);
    }
  }
};
