import Vue from 'vue'
import AppTodo from './AppTodo.vue'
import vuetify from '../plugins/vuetify'

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(AppTodo),
}).$mount('#app')
