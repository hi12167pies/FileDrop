(async function () {
  const headerVersion = document.getElementById("header-version")

  if (headerVersion == null) return

  const res = await fetch("/version")
  const json = await res.json()

  headerVersion.innerText = "v" + json.version
})()