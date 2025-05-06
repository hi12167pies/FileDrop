import { Router } from "express";
import { existsSync, readFileSync } from "fs";
import { retrieveFileMeta } from "../database";
import path from "path";
import { UPLOAD_DIRECTORY } from "..";

const router = Router()

router.get("/file/:id", async (req, res) => {
  const id = req.params.id
  const filePath = path.join(UPLOAD_DIRECTORY, id)

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

export { router as FileViewRouter }