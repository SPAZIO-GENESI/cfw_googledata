export default { 
  async fetch(request, env) { 
    const url = new URL(request.url)
    const sheetId = url.searchParams.get("sheet")
    const f = url.searchParams.get("f") // Ad esempio 'A3SD21'

    console.log("Incoming request:", url.toString())
    console.log("Sheet:", sheetId, "f:", f)
    
    // Il Secret JSON è ora env.GOOGLE_API_KEY_M
    const apiKeyMapJSON = env.GOOGLE_API_KEY_M 
    
    if (!apiKeyMapJSON) {
        console.error("Missing GOOGLE_API_KEY_M secret")
        return new Response(JSON.stringify({ error: "Configuration Error: API Key Map secret not found." }), { status: 500 })
    }

    let apiKeyMap
    try {
        // Parsa il JSON in un oggetto
        apiKeyMap = JSON.parse(apiKeyMapJSON)
    } catch (e) {
        console.error("Error parsing GOOGLE_API_KEY_M:", e)
        return new Response(JSON.stringify({ error: "Configuration Error: API key map is invalid JSON." }), { status: 500 })
    }

    // Cerca la chiave API utilizzando il valore dinamico di 'f'
    const apiKey = apiKeyMap[f]

    if (!apiKey) {
        console.log(`Key not found in map for f: ${f}`)
        return new Response(JSON.stringify({ error: "Invalid 'f' parameter key or key not found in map." }), { status: 400 })
    }

    console.log("Secret name:", `Key for f=${f}`, "Found:", !!apiKey)

    try {
        const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Disponibili?key=${apiKey}`
        const response = await fetch(sheetsUrl)
        
        // Controlla se la risposta API è un errore (es. chiave API non valida)
        if (!response.ok) {
            const errorData = await response.json()
            console.error("Sheets API failed:", errorData)
            return new Response(JSON.stringify(errorData), { status: response.status, headers: { "Content-Type": "application/json" } })
        }

        const data = await response.json()
        console.log("Sheets API response sample:", JSON.stringify(data).slice(0, 200))
        
        return new Response(JSON.stringify(data), { 
            headers: { 
                "Content-Type": "application/json",
                // Aggiungere headers CORS è spesso necessario per i Workers
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET"
            } 
        })
    } catch (err) {
        console.error("Error fetching Sheets:", err)
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
  } 
}