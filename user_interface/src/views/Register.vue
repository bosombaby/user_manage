<template>
    <el-form :model="registerForm" class="register-form" ref="form" >
        <!-- 账户 -->
        <el-form-item label="账号" prop="username" :rules="[{ required: true, message: '账号不能为空', trigger: 'blur' }]">
            <el-input v-model=registerForm.username  />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '密码不能为空', trigger: 'blur' }]">
            <el-input v-model="registerForm.password" type="password" />
        </el-form-item>

        <el-form-item >
            <el-button type="primary" @click="sumbitInfo">注册</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>

import { ref, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router';
import { customAlphabet } from 'nanoid'
import axios from 'axios'

const {proxy} =getCurrentInstance()
const router=useRouter()
//后端请求
const request = axios.create({
    baseURL:'http://127.0.0.1:8080'
})

const registerForm = reactive({
    id: '', username: '', password: '',level:2
})

const createId = () => {
    const nanoid = customAlphabet('vrteam_123456789', 9)
    return nanoid()

}

//注册用户
const sumbitInfo =  () => {

    proxy.$refs.form.validate(async (valid, fields) => {
        if (valid) {
            //唯一id
            registerForm.id = createId()
            registerForm.level = 2
            let userData={username:registerForm.username}
            let onlyCheck = await request.get('/user/check', { params: userData })

            if (onlyCheck.data.data.length) {
                alert('用户名已存在，请重新输入！')
            } else {
                let res = await request.post('/user/register', registerForm)
                if (res.data.data.affectedRows) {
                    alert('注册成功')
                    router.push({path:'/login'})
                } else {
                    alert('注册失败')
                }
            }
        } else {
            alert('数据不合法')
        }
    })
    
}
</script>

<style lang="less" scoped>
.register-form{
    width: 250px;
    margin:200px auto;
    
    :deep( .el-form-item__content){
        justify-content: space-around;
    }
}
</style>