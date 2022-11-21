import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect:'/login'
    },
    {
        path: '/login',
        name:'login',
        component:()=>import('../views/Login.vue')
    },
    {
        path: '/register',
        component:()=>import('../views/Register.vue')
    },
    {
        path: '/layout',
        component:()=>import('../views/Layout/Layout.vue'),
        children:[
            {
                path: '/layout/home0',
                name:'home0',
                component:()=>import('../views/Layout/Home0.vue'),
            },
            {
                path: '/layout/home1',
                name:'home1',
                component:()=>import('../views/Layout/Home1.vue'),
            },
            {
                path: '/layout/home2',
                name:'home2',
                component:()=>import('../views/Layout/Home2.vue'),
            },]
    }
]

const router = createRouter({
    history:createWebHashHistory(),
    routes,
   
})
export default router