import { config } from "dotenv"
import express from "express"
import { existsSync, mkdirSync } from "fs"
import multer from "multer"
import path from "path"
import packageJson from "../package.json"

config()

export const DISABLED_FILE_BROWSING = process.env.DISABLE_FILE_BROWSING == "true"

const app = express()

app.use(express.urlencoded({
  extended: false
}))

app.set("view engine", "ejs")

export const UPLOAD_DIRECTORY = path.join(process.cwd(), "uploads")

if (!existsSync(UPLOAD_DIRECTORY)) {
  mkdirSync(UPLOAD_DIRECTORY)
}

export const MULTER_MIDDLEWARE = multer({
  dest: UPLOAD_DIRECTORY
})

// Import routers here as they require exported variables
import { FileListRouter } from "./router/fileListRouter"
import { FileViewRouter } from "./router/fileViewRouter"
import { UploadRouter } from "./router/uploadRouter"

app.use(
  express.static("public"),
  
  UploadRouter,
  FileViewRouter,
  FileListRouter
)

app.get("/version", (req, res) => {
  res.json({
    version: packageJson.version
  })
})

const server = app.listen(process.env.PORT, () => {
  console.log("Webserver online at port " + process.env.PORT)
})

server.setTimeout(0)