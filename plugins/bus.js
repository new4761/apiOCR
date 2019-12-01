import Vue from 'vue'

let data = 0;
export const eventBus = {

  getValue() {
    // console.log("get");
    // console.log(this.data);
    return data       // Do something
  },
  updateValue() {
    // console.log("get");
    // console.log(this.data);
    data++
    // Do something
  },

}

eventBus.install = function (Vue) {
  Vue.prototype.$bus = new Vue()
}

Vue.use(eventBus)