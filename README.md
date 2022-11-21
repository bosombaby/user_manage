# VUE3 + Vite 构建用户后台管理

## 一、前言



本篇文章从头到尾过一遍vue3搭建项目的过程，建议实现一个用户登录、注册，根据身份等级判断登录界面的应用。前端采用`vue3+vite+element-plus`，后端使用`node.js+koa+mysql`。





![2](https://gitee.com/riskbaby/picgo/raw/master/blog/202211211945680.png)

![4](https://gitee.com/riskbaby/picgo/raw/master/blog/202211212039579.png)



![5](https://gitee.com/riskbaby/picgo/raw/master/blog/202211212039983.png)

## 二、依赖配置

```js
{
  "name": "user_interface",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@element-plus/icons-vue": "^2.0.10",
    "axios": "^1.1.3",
    "element-plus": "^2.2.22",
    "nanoid": "^4.0.0",
    "vue": "^3.2.41",
    "vue-router": "^4.0.12"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^3.2.0",
    "less": "^4.1.3",
    "unplugin-auto-import": "^0.11.4",
    "unplugin-vue-components": "^0.22.9",
    "vite": "^3.2.3"
  }
}

```



<img src="https://gitee.com/riskbaby/picgo/raw/master/blog/202209101049782.png" alt="2" style="zoom:80%;" />

- `node_modules `文件夹用来存放所有已安装到项目中的包。require() 导入第三方包时，就是从这个目录中查找并加载包。
- `package-lock.json` 配置文件用来记录 node_modules 目录下的每一个包的下载信息，例如包的名字、版本号、下载地址等。
- `package.json`项目的名称、版本号、描述等、用到了哪些包、开发期间使用的包、部署使用的包
  - `devDependencies `：开发依赖
  - `dependencies `：核心依赖
- **注意**：程序员不要手动修改 node_modules 或 package-lock.json 文件中的任何代码，npm 包管理工具会自动维护它们，**今后在项目开发中，一定要把 node_modules 文件夹，添加到 .gitignore 忽略文件中**



## 三、koa框架



这次采取`KOa`框架作为后端，`Koa`是`express`同一个团队开发，自由度、灵活度更高，异步请求也更加灵活了。后端主要还是对前端接口返回json数据，前端好进行数据处理。

```js
const Koa = require('koa')
const cors=require('@koa/cors')
const router=require('./router/')
const bodyParser=require('koa-bodyparser')

//静态变量
const PORT = 8080

const app = new Koa()
// 跨域
app.use(bodyParser())
app.use(cors())
app.use(router.routes())

app.listen(PORT, () => {
    console.log(`http://127.0.0.1:${PORT}`);
})

```

之前看到几个写得比较好的`koa`框架教程，只不过有点老了，但思想还是通用的。

[**koa框架**](https://blog.csdn.net/mantou_riji/article/details/125698327)

[**技术博客**](https://chenshenhai.com/koa2-note/note/mysql/README)

## 四、数据库



**user_info**

| 键名         | 字段        | 主键 | 不为空 |
| ------------ | ----------- | ---- | ------ |
| **id**       | VARCHAR(10) | 1    | 1      |
| **username** | VARCHAR(45) | 0    | 1      |
| **password** | VARCHAR(45) | 0    | 1      |
| **level**    | INT         | 0    | 1      |



其中，level三个数值0 1 2分别代表超级管理员、管理员、普通用户

这次，刚开始请求数据库资源的时候，只用了简单的`async/await`，导致后端发送的一直是前端上一次请求的数据，淦！后来，发现对数据库整体请求要单独封装一个`Promise`对象，代码如下：

```js
const mysql = require('mysql')

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database:'3d_resources'
    
})

let query = (sql, values)=> {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject('数据库连接出错',err)
            } else {
                connection.query(sql, values, (err, results) => {
                    if (err) {
                        reject('数据库语句出错',err)
                    } else {
                        resolve(results)
                    }
                    connection.release()
                })
            }
        })
    })
}

module.exports=query
```



## **五、路由**

`vue3`的路由使用和`vue2`已经完全不一样了，`vue3`使用起来更加自由，用到什么功能就导入对应的`函数`，但有时候写代码也下不去手。下面，主要讲解一下路由的基本使用。首先，创建`router`文件夹，统一管理路由。

```js
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
```



`createWebHashHistory()`是路径问题，就是访问的时候带有`/#/`这个符号。`Vue-Router`有两种模式：`hash`模式和`history`模式。默认的路由模式是`hash`模式。



对于页面路由跳转，使用，传参啥的，使用` useRouter ,useRoute`两个生成参数，不使用`this`了。



`推荐文章`：[vue3中关于路由hash与History的设置](https://www.jb51.net/article/258148.htm)



**路由关系**：

- 登录
- 注册
- 展示
  - 超级管理员界面
  - 管理员界面
  - 用户界面

其中，登录界面可以跳转到注册界面，注册完成跳转到登录界面。登录并且后端数据库验证通过，根据用户的身份进入不同的展示界面。



## 六、前端界面

### 6.1 登录界面

![3](https://gitee.com/riskbaby/picgo/raw/master/blog/202211212007365.png)

```vue
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
```

本次对利用`element-plus`快速搭建前端`表单样式`，对于非空也进行一点小小的判断。这里路由传参是，注意`params只能使用name`切换路由，而且可能是由于版本问题，`params`请求参数一直未被收集到。登录成功，根据`level`进入不同的管理界面。



### 6.2 注册界面

![4](https://gitee.com/riskbaby/picgo/raw/master/blog/202211212012607.png)

![5](https://gitee.com/riskbaby/picgo/raw/master/blog/202211212012110.png)



```vue
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
```

`注册界面`对于后端有两次请求，一次是判断用户名是否唯一化的`预检查`，第二次才是真正的写入`数据库`。对于`id`的生成，采用`nanoid`。



### 6.3 展示界面

![6](https://gitee.com/riskbaby/picgo/raw/master/blog/202211212017513.png)



![7](https://gitee.com/riskbaby/picgo/raw/master/blog/202211212017082.png)



就是普通的展示，没写太多东西，纯纯练手小项目。



## 七、阿里云部署



都写到这了，就体验一下项目上线的流程吧，本次采用`阿里云`服务器加上内置的`宝塔面板`部署。

### 7.1 前端项目

vue输入命令` npm run build`打包项目，生成`dist`文件夹，文件夹上传服务器，进入宝塔面板。

<img src="https://gitee.com/riskbaby/picgo/raw/master/blog/202211212021749.png" alt="8" style="zoom:50%;" />



填写公网`ip`或者`域名`，部署网站，这里默认`80端口`，切换端口再ip后端直接写就行。**这里注意一点，端口一定要再宝塔面板的安全和服务器的防火请开启，不然访问不了。**



### 7.2 后端node

这里采![9](https://gitee.com/riskbaby/picgo/raw/master/blog/202211212023002.png)



![](https://gitee.com/riskbaby/picgo/raw/master/blog/202211212024885.png)





用`pm2`配置项目，软件商店下载`pm2`，这里node版本尽量和本机开发环境一致，模块管理也就是`npm`包管理，**这里的项目端口注意开放**。这里我部署的时候还有一个问题，终端输入`pm2`和`node -v`无法识别`command`，这里是没有配置`环境变量`的问题。我们可以使用软连接配置或者写入环境变量，这里直接网上搜一下就行了。



### 7.3 mysql安装

![](https://gitee.com/riskbaby/picgo/raw/master/blog/202211212029133.png)



这里`mysql`添加，注意数据库的参数要和后端一致，编码也要一致。数据库创建完成之后，把`mysql`数据导入本地，然后上传`服务器`。



<img src="https://gitee.com/riskbaby/picgo/raw/master/blog/202211212033659.png" style="zoom:50%;" />

### 7.4 测试



<img src="https://gitee.com/riskbaby/picgo/raw/master/blog/202211212035253.png" style="zoom:50%;" />

没啥问题



## 八、总结

本次对于`vue3+koa`前后端交互的项目有了一个大的了解，对于项目开发、上线流程有了一个大体的了解。但对于用户的持久化(`cookie、sessioj`)、路由限制这些没有应用到项目里面去，后续有时间慢慢完善技术，go!!!。

![](https://gitee.com/riskbaby/picgo/raw/master/blog/202211212043288.png)