import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import money from "v-money";

// register directive v-money and component <money>
Vue.config.productionTip = false;
Vue.use(BootstrapVue, {
  BButton: { variant: "light" },
});
Vue.use(BootstrapVueIcons);
Vue.use(money, {
  decimal: ",",
  thousands: ".",
  prefix: "",
  suffix: " €",
  precision: 2,
  masked: false,
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
