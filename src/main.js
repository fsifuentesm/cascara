import Vue from 'vue';
import moment from 'moment';
import 'whatwg-fetch';
import App from './App';
import router from './router';
import './fontawesome';
import i18n from './i18n';

moment.locale('es');

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>',
});

