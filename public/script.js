const fileElement = document.getElementById("data")
const fileLabel = document.getElementById("data-label")

const progressHolder = document.getElementById("progress-holder")
const progressElement = document.getElementById("progress")

const uploadBtn = document.getElementById("upload-btn")
const form = document.getElementById("form")

/**
 * This is the xhr request for uploading the file.
 * @type { XMLHttpRequest | null }
*/
let xhr = null

// This method handles showing the file that is selected in the custom file upload element
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

// This method handles when the form is submitted and uploading the file
// This is in javascript to allow for progress text 
form.addEventListener("submit", event => {
  event.preventDefault()

  /** @type { FileList } */
  const files = fileElement.files
  if (files == null || files.length == 0) {
    alert("Please select a file using the 'Select File' button.")
    return
  }
  
  // Disable upload button so user cannot upload again
  uploadBtn.disabled = true

  const file = files[0]
  
  xhr = new XMLHttpRequest()
  const formData = new FormData()
  formData.append("data", file)

  // Start the timer for when the request has started, used to calculate the speed of uploading
  let startTime
  xhr.upload.addEventListener('loadstart', () => {
    startTime = Date.now()
  })

  // Show the progress holder element
  progressHolder.hidden = false

  xhr.upload.addEventListener("progress", (uploadEvent) => {
    if (uploadEvent.lengthComputable) {
      const elapsedTime = (Date.now() - startTime) / 1000; // seconds
      const bitsLoaded = uploadEvent.loaded * 8; // convert bytes to bits
      const bitPerSecond = bitsLoaded / elapsedTime; // bits per second

      const percent = (uploadEvent.loaded / uploadEvent.total) * 100

      // Lots of information is provided as I think it is important
      progressElement.innerText = `Uploading: ${Math.round(percent)}% (${formatBytes(uploadEvent.loaded)} / ${formatBytes(uploadEvent.total)}, ${formatBits(bitPerSecond)})`
    }
  })

  xhr.onload = () => {
    if (xhr.status === 200) {
      progressElement.textContent = "Upload complete!"

      // Redirect user to newly uploaded file
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