import { Router } from "express";
import { AppInfo, Permission, PieSDK } from "../pies";
import cookieParser from "cookie-parser"

const router = Router()

const pies = new PieSDK(process.env.PIES_API_KEY as string)

let appInfo: AppInfo

if (process.env.PIES_AUTH_ENABLED == "true") {
  pies.getAppInfo().then(info => {
    appInfo = info
    console.log("App info recieved.")
  }).catch(err => {
    console.error(err)
    process.exit()
  })
}

router.use(cookieParser())

// Cache
const cache: {
  [key: string]: {
    allowed: boolean
  }
} = {}

router.use(async (req, res, next) => {
  if (req.url.startsWith("/file/") || req.url.endsWith(".css")) {
    next()
    return
  }

  if (appInfo == undefined) {
    res.render("message.ejs", {
      message: "Waiting for app to update, refresh in a moment."
    })
    return
  }
  
  if (req.query.code) {
    res.cookie("token", req.query.code)
    res.redirect("/")
    return
  }

  // We shall now check if the user is authenticated
  if (!req.cookies.token) {
    res.redirect(appInfo.auth_url)
    return
  }

  const cacheValue = cache[req.cookies.token as string]
  if (cacheValue != undefined) {
    if (cacheValue.allowed) {
      next()
    } else {
      res.render("message.ejs", {
        message: "You are not authorized to visit this page."
      })   
    }
    return
  }

  let perms: Permission[]
  try {
    perms = await pies.getAccountPermissions(req.cookies.token)
  } catch (error) {
    res.clearCookie("token")
    res.render("message.ejs", {
      message: "Invalid token, refresh to reset"
    })
    return
  }
  
  const allowed = perms.includes("filedrop")
  cache[req.cookies.token] = {
    allowed
  }
  if (allowed) {
    next()
  } else {
    res.render("message.ejs", {
      message: "You are not authorized to visit this page."
    })
  }
})

export { router as PiesAuthRouter }