<template>
    <el-form :model="loginForm" class="login-form" ref="form">
        <!-- 账户 -->
        <el-form-item label="账号" prop="username" :rules="[{ required: true, message: '账号不能为空', trigger: 'blur' }]">
            <el-input v-model=loginForm.username />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '密码不能为空', trigger: 'blur' }]">
            <el-input v-model="loginForm.password" type="password" />
        </el-form-item>

        <el-form-item class="last">
            <el-button type="primary" @click="checkInfo">登录</el-button>
            <el-button type="success" @click="enterRegister">进入注册</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref, reactive,getCurrentInstance,onMounted } from 'vue'
import { useRouter ,useRoute} from 'vue-router'

import axios from 'axios'

const {proxy}=getCurrentInstance()

const loginForm = reactive({
    id: '', username: '', password: '',level:2
})

const router=useRouter()
const route=useRoute()

const request = axios.create({
    baseURL:'http://127.0.0.1:8080'
})



//账号验证
const checkInfo =  () => {
    //服务端验证账号密码
    proxy.$refs.form.validate(async (valid,fields) => {
        if (valid) {
            let userData={}
            let res= await request.post('/user/login', { username: loginForm.username, password: loginForm.password })
            if (!res.data.data.length) {
                alert('用户名或者密码错误！')
            } else {
                const username=res.data.data[0].username
                const level = res.data.data[0].level
                router.push({ name:`home${level}`,query:{username}})
            }
        }
        else {
            alert('数据不合法！')
        }
    })

}

//账号注册
const enterRegister = async () => {
    router.push({path:'/register'})
}


</script>

<style lang="less" scoped>
.login-form{
    width: 250px;
    margin: 200px auto;
    
    :deep(.el-form-item__content)  {
        justify-content: space-between;
    }
}
</style>