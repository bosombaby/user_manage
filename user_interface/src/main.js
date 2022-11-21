import { createApp } from 'vue'

//路由使用
import router from './router'
import App from './App.vue'
import './assets/style/index.css'

//图标的基本使用
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.mount('#app')
