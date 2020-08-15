import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// register directive v-money and component <money>
Vue.config.productionTip = false;
Vue.use(BootstrapVue, {
  BButton: { variant: "light" },
});
Vue.use(BootstrapVueIcons);


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
