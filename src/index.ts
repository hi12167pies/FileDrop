import { config } from "dotenv"
import express from "express"
import { existsSync, mkdirSync, readFileSync } from "fs"
import multer from "multer"
import path from "path"
import { FileMeta, retrieveFileMeta, storeFileMeta } from "./database"
import packageJson from "../package.json"

config()

const app = express()

app.use(express.urlencoded({
  extended: false
}))

app.set("view engine", "ejs")

export const uploadDirectory = path.join(process.cwd(), "uploads")

if (!existsSync(uploadDirectory)) {
  mkdirSync(uploadDirectory)
}

const upload = multer({
  dest: uploadDirectory
})

app.use(express.static("public"))

app.get("/file/:id", async (req, res) => {
  const id = req.params.id
  const filePath = path.join(uploadDirectory, id)

  if (!existsSync(filePath)) {
    res.status(404).send("File not found.")
    return
  }

  const metadata = await retrieveFileMeta(id)

  if (metadata == null) {
    res.status(404).send("File meta missing.")
    return
  }

  const action = req.query.action || ""
  if (action == "download") {
    res.download(filePath, metadata.name)
    return
  }

  if (action == "view") {
    const file = readFileSync(filePath)

    res.header("Content-Type", metadata.type)
    res.write(file)
    res.end()
    return
  }

  res.render("file.ejs", {
    id, meta: metadata
  })
})

app.post("/upload", upload.single("data"), async (req, res) => {
  if (req.file == undefined) {
    res.status(400).send("Error occured: File was not uploaded in request.")
    return
  }

  const meta: FileMeta = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
    uploaded: Date.now()
  }

  await storeFileMeta(req.file.filename, meta)

  res.redirect("/file/" + req.file.filename)
})

app.get("/version", (req, res) => {
  res.json({
    version: packageJson.version
  })
})

const server = app.listen(process.env.PORT, () => {
  console.log("Webserver online at port " + process.env.PORT)
})

server.setTimeout(0)