export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const sheetId = url.searchParams.get("sheet")
    const f = url.searchParams.get("f")

    console.log("Incoming request:", url.toString())
    console.log("Sheet:", sheetId, "f:", f)

    const secretName = `GOOGLE_API_KEY_${f}`
    const apiKey = env[secretName]

    console.log("Secret name:", secretName, "Found:", !!apiKey)

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Disponibili?key=${apiKey}`
      )
      const data = await response.json()
      console.log("Sheets API response sample:", JSON.stringify(data).slice(0, 200))

      return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } })
    } catch (err) {
      console.error("Error fetching Sheets:", err)
      return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
  }
}
