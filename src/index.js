export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const sheetId = url.searchParams.get("sheet")
    const f = url.searchParams.get("f")

    console.log("Incoming request:", url.toString())
    console.log("Sheet:", sheetId, "f:", f)

    if (!sheetId) return new Response("Missing sheet parameter", { status: 400 })
    if (!f) return new Response("Missing f parameter", { status: 400 })

    const secretName = `GOOGLE_API_KEY_${f}`
    const apiKey = env[secretName]

    console.log("Secret name:", secretName, "Found:", !!apiKey)

    if (!apiKey) return new Response(`Missing secret ${secretName}`, { status: 500 })

    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Disponibili?key=${apiKey}`
    console.log("Calling Sheets API:", sheetUrl)

    try {
      const response = await fetch(sheetUrl)
      const data = await response.json()
      console.log("Sheets API response:", JSON.stringify(data).slice(0, 200)) // log primi 200 caratteri

      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        }
      })
    } catch (err) {
      console.error("Error fetching Sheets:", err)
      return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
  }
}
