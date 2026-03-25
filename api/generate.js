export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { text } = req.body;

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "db21e45c8f3b1a6a2e4e3c2f5c4d2c9d6b3e9f4b1a6d7c8e9f0a1b2c3d4e5f6", 
        input: {
          prompt: `realistic handwriting on notebook paper: ${text}`
        }
      })
    });

    const data = await response.json();

    // polling (important)
    let result = data;

    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise(r => setTimeout(r, 2000));

      const poll = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`
        }
      });

      result = await poll.json();
    }

    if (result.status === "succeeded") {
      res.status(200).json({ image: result.output[0] });
    } else {
      res.status(500).json({ error: "Generation failed" });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
