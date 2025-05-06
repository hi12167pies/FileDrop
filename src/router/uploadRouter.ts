import { Router } from "express";
import { MULTER_MIDDLEWARE } from "..";
import { FileMeta, storeFileMeta } from "../database";

const router = Router()

router.post("/upload", MULTER_MIDDLEWARE.single("data"), async (req, res) => {
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

export { router as UploadRouter }