const {Router} = require("express")
const authController  = require("../controllers/auth.controller")
const authRouter = Router()
const authMidlleware = require("../middleware/auth.middleware")
/**
 * @route POST /api/auth/register
 * @description Register new user
 * @access Public
 */

authRouter.post("/register",authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description Login user with email and password
 * @access Public
 */
authRouter.post("/login",authController.loginUserController)


/**
 * @route GET /api/auth/logout
 * @description clear the token cookie to logout the user and add token in the blacklist
 * @access Public
 */
authRouter.get("/logout",authController.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description get the profile of logged in user, requires token in cookie
 * @access Private
 */
authRouter.get("/get-me",authMidlleware.authUser,authController.getMeController)
module.exports = authRouter;