const loading = document.getElementById("loading")

const error = document.getElementById("error")
const errorContent = document.getElementById("error-content")

const fileTable = document.getElementById("fileTable")
const table = document.getElementById("table")

/**
 * Hides all other elements and only shows the one provided in the function 
 * Used since there is 3 elements (table, loading, error)
 */
function showOnly(element) {
  loading.hidden = true
  error.hidden = true
  fileTable.hidden = true

  element.hidden = false
}

// Get all the files
fetch("/files")
  .then(res => res.json())
  .then(json => {
    if (!json.success) {
      throw new Error(json.reason)
    }

    /**
     * @type { any[] }
     */
    const files = json.files

    files.sort((a, b) => b.uploaded - a.uploaded)
      .forEach(file => {
        addFile(file)
      })

    showOnly(fileTable)
  }).catch(fetchError => {
    console.error(fetchError)
    showOnly(error)
    errorContent.innerText = fetchError.toString()
  })

/**
 * This method adds the file to the table with a link to it in the name column. 
 */
function addFile(file) {
  const tr = document.createElement("tr")

  const name = document.createElement("td")
  const nameLink = document.createElement("a")
  name.appendChild(nameLink)
  
  const size = document.createElement("td")
  const date = document.createElement("td")

  nameLink.href = "/file/" + file.hash
  nameLink.innerText = file.name
  size.innerText = formatBytes(file.size)
  date.innerText = new Date(file.uploaded).toLocaleString()

  tr.appendChild(name)
  tr.appendChild(size)
  tr.appendChild(date)

  table.appendChild(tr)
}