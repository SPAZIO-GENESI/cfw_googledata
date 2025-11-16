export default {
  async fetch(request, env) {  // <-- il secret viene passato come env
    const sheetId = new URL(request.url).searchParams.get("sheet")
    if (!sheetId) return new Response("Missing sheet parameter", { status: 400 })

    // Usa il secret dal binding
    const apiKey = env.GOOGLE_API_KEY
    if (!apiKey) return new Response("Missing GOOGLE_API_KEY secret", { status: 500 })

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
