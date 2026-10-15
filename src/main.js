
import { createApp } from 'vue'
import {
  createRouter,
  createWebHistory
} from 'vue-router'

import App from './App.vue'
import Home from './views/Home.vue'
import Dashboard from './views/Dashboard.vue'
import Students from './views/Students.vue'
import Courses from './views/Courses.vue'
import Reports from './views/Reports.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/dashboard', component: Dashboard },
    { path: '/students', component: Students },
    { path: '/courses', component: Courses },
    { path: '/reports', component: Reports },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior: () => ({ top: 0 })
})

createApp(App)
  .use(router)
  .mount('#app')
