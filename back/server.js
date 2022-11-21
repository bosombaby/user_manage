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
