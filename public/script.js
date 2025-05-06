const fileElement = document.getElementById("data")
const fileLabel = document.getElementById("data-label")

const progressHolder = document.getElementById("progress-holder")
const progressElement = document.getElementById("progress")

const uploadBtn = document.getElementById("upload-btn")
const form = document.getElementById("form")

/** @type { XMLHttpRequest | null } */
let xhr = null

fileElement.addEventListener("change", event => {
  /** @type { FileList } */
  const files = fileElement.files

  if (files == null || files.length == 0) {
    fileLabel.innerText = "No file selected"
    return
  }

  const file = files[0]

  fileLabel.innerText = file.name + ` (${formatBytes(file.size)})`
})

form.addEventListener("submit", event => {
  event.preventDefault()

  /** @type { FileList } */
  const files = fileElement.files
  if (files == null || files.length == 0) {
    alert("Please select a file using the 'Select File' button.")
    return
  }
  
  uploadBtn.disabled = true
  const file = files[0]
  
  xhr = new XMLHttpRequest()
  const formData = new FormData()
  formData.append("data", file)

  let startTime
  xhr.upload.addEventListener('loadstart', () => {
    startTime = Date.now()
  })

  progressHolder.hidden = false
  xhr.upload.addEventListener("progress", (uploadEvent) => {
    if (uploadEvent.lengthComputable) {
      const elapsedTime = (Date.now() - startTime) / 1000; // seconds
      const bitsLoaded = uploadEvent.loaded * 8; // convert bytes to bits
      const bitPerSecond = bitsLoaded / elapsedTime; // bits per second

      const percent = (uploadEvent.loaded / uploadEvent.total) * 100
      progressElement.innerText = `Uploading: ${Math.round(percent)}% (${formatBytes(uploadEvent.loaded)} / ${formatBytes(uploadEvent.total)}, ${formatBits(bitPerSecond)})`
    }
  })

  xhr.onload = () => {
    if (xhr.status === 200) {
      progressElement.textContent = "Upload complete!"
      location.href = xhr.responseURL
    } else {
      progressElement.textContent = `Error: ${xhr.statusText}`
    }
  }

  xhr.onerror = (e) => {
    progressElement.textContent = "Upload failed."
    alert(e)
  }

  xhr.timeout = 0

  xhr.open("POST", "/upload")
  xhr.send(formData)
})

form.addEventListener("cancel", event => {
  uploadBtn.disabled = false
  if (xhr != null) {
    xhr.abort()
  }
})

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const value = bytes / Math.pow(k, i)
  return `${parseFloat(value.toFixed(decimals))} ${sizes[i]}`
}

function formatBits(bits, decimals = 2) {
  if (bits === 0) return '0 bps'

  const k = 1000;
  const sizes = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps', 'Pbps', 'Ebps', 'Zbps', 'Ybps']
  const i = Math.floor(Math.log(bits) / Math.log(k))

  const value = bits / Math.pow(k, i)
  return `${parseFloat(value.toFixed(decimals))} ${sizes[i]}`
}
