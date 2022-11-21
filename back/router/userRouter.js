const Router = require('@koa/router')
const router = new Router()
const query=require('../db/async-db.js')

let queryAll = 'select * from user_info'
let queryUser = 'select * from user_info where username=? and password=?'
let preCheck='select * from user_info where username=?'
let insertUser='insert into user_info set ?'

router.get('/', async ctx => {
    
    ctx.body = {
        code: 200,
        msg:'成功连接'
    }
})

router.get('/users', async ctx => {

    let res= await query(queryAll)
    ctx.body = {
        code: 200,
        msg:res
    }
})

router.post('/user/login', async ctx => {
    //数据库验证
    let values = [ctx.request.body.username,ctx.request.body.password ]
    let res = await query(queryUser, values)
    ctx.body = {
        code: 200,
        data:res
    }
})

//预检查username
router.get('/user/check', async ctx => {
    let value=ctx.request.query.username
    let res = await query(preCheck, value)
    ctx.body = {
        code: 200,
        data:res
        
   }
})


router.post('/user/register', async ctx => {
    //数据库验证
    let values = ctx.request.body
    let res=await query(insertUser,values)
    
    ctx.body = {
        code: 200,
        data:res
    }
})

module.exports=router