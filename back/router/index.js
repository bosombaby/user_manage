const Router=require('@koa/router')
const userRouter = require('./userRouter')

const router = new Router()
router.use(userRouter.routes(), router.allowedMethods())

module.exports=router
