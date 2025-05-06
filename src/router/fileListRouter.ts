import { Router } from "express";
import { retrieveAllFileMeta } from "../database";
import { DISABLED_FILE_BROWSING } from "..";

const router = Router()

router.get("/files", async (req, res) => {
  if (DISABLED_FILE_BROWSING) {
    res.json({
      success: false,
      reason: "File browsing is disabled on this server"
    })
    return
  }

  const meta = await retrieveAllFileMeta()

  if (meta == null) {
    res.json({
      success: false,
      reason: "Meta is null"
    })
    return
  }

  res.json({
    success: true,
    files: [
      ...meta
    ]
  })
})

export { router as FileListRouter }