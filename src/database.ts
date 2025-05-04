// Basic json database

import { writeFileSync } from "fs"
import { readFileSync } from "fs"
import path from "path"
import { uploadDirectory } from "."

const databasePath = path.join(process.cwd(), "data.json")

export type FileMeta = {
  /**
   * The original file name when uploaded.
   */
  name: string,

  /**
   * The MIME type of the file.
   */
  type: string,

  /**
   * The file size in bytes.
   */
  size: number,
  
  /**
   * The date the file was uploaded, UNIX timestamp.
   */
  uploaded: number
}

export async function storeFileMeta(id: string, meta: FileMeta) {
  const filePath = path.join(uploadDirectory, id + ".metadata")
  writeFileSync(filePath, JSON.stringify(meta))
}

export async function retrieveFileMeta(id: string): Promise<FileMeta | null> {
  const filePath = path.join(uploadDirectory, id + ".metadata")
  return JSON.parse(readFileSync(filePath, "utf8"))
}