// Request and display the version of the application in the header
(async function () {
  const headerVersion = document.getElementById("header-version")

  if (headerVersion == null) return

  const res = await fetch("/version")
  const json = await res.json()

  headerVersion.innerText = "v" + json.version
})()