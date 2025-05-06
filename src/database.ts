// Basic json database

import { readdirSync, writeFileSync } from "fs"
import { readFileSync } from "fs"
import path from "path"
import { UPLOAD_DIRECTORY } from "."

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

export type FileMetaHash = FileMeta & {
  /**
   * The new hashed name of the file
   */
  hash: string
}

export async function storeFileMeta(id: string, meta: FileMeta) {
  const filePath = path.join(UPLOAD_DIRECTORY, id + ".metadata")
  writeFileSync(filePath, JSON.stringify(meta))
}

export async function retrieveFileMeta(id: string): Promise<FileMeta | null> {
  const filePath = path.join(UPLOAD_DIRECTORY, id + ".metadata")
  return parseFileMeta(readFileSync(filePath, "utf8"))
}

export async function retrieveAllFileMeta(): Promise<FileMetaHash[] | null> {
  return readdirSync(UPLOAD_DIRECTORY)
    .filter(file => file.endsWith(".metadata"))
    .map(file => {
      const filePath = path.join(UPLOAD_DIRECTORY, file)
      const fileMeta: any = parseFileMeta(readFileSync(filePath, "utf8"))
      fileMeta.hash = file.split(".")[0]
      return fileMeta
    })
}

function parseFileMeta(fileData: string): FileMeta {
  return JSON.parse(fileData) as FileMeta
}