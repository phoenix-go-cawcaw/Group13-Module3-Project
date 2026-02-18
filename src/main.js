import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'primeicons/primeicons.css'
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(MotionPlugin)

app.mount('#app')
