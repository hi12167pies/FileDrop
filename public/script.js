const fileElement = document.getElementById("data")
const fileLabel = document.getElementById("data-label")

fileElement.addEventListener("change", event => {
  /** @type { FileList } */
  const files = fileElement.files

  if (files.length == 0) {
    fileLabel.innerText = "No file selected"
    return
  }

  const file = files[0]

  fileLabel.innerText = file.name
})