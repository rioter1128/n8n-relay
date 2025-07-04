export default async function handler(req, res) {
  // Define your Chrome extension's exact origin
  const chromeExtensionOrigin = "chrome-extension://bekjdcloeonopknikkeeligkbcegjbek";

  // Set CORS header to specifically allow your Chrome extension's origin
  res.setHeader("Access-Control-Allow-Origin", chromeExtensionOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // If your extension also sends credentials (e.g., cookies, although less common for simple API calls)
  // you might also need this. For simple POSTs, it's often not strictly necessary but good practice
  // if you anticipate any authentication mechanisms.
  // res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    // Preflight request, respond with 200 OK
    return res.status(200).end();
  }

  try {
    const response = await fetch("https://rioter1128.app.n8n.cloud/webhook/ai-draft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    // Check if the response from n8n was successful
    if (!response.ok) {
      const errorData = await response.text(); // Get raw error response for debugging
      console.error("n8n webhook responded with an error:", response.status, errorData);
      return res.status(response.status).json({ error: `Error from n8n: ${errorData}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error forwarding request:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
