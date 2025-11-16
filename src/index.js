export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const sheetId = url.searchParams.get("sheet");
    if (!sheetId) {
      return new Response("Missing sheet parameter", { status: 400 });
    }

    const apiKey = env.GOOGLE_API_KEY;
    const range = "Disponibili";

    const target = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    // Richiama Google
    const response = await fetch(target, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
      // niente keepalive → evita problemi di idle
    });

    const data = await response.text();

    // CORS
    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Cache-Control": "no-store"
      }
    });
  }
};
