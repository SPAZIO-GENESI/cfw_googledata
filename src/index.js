export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // Parametri dall'URL
    const sheetId = url.searchParams.get("sheet")
    const f = url.searchParams.get("f")

    if (!sheetId) {
      return new Response("Missing sheet parameter", { status: 400 })
    }
    if (!f) {
      return new Response("Missing f parameter", { status: 400 })
    }

    // Costruisci dinamicamente il nome del secret
    const secretName = `GOOGLE_API_KEY_${f}`
    const apiKey = env[secretName]

    if (!apiKey) {
      return new Response(`Missing secret ${secretName}`, { status: 500 })
    }

    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Disponibili?key=${apiKey}`

    try {
      const response = await fetch(sheetUrl)
      const data = await response.json()

      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        }
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
  }
}
