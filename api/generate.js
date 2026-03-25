export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { text } = req.body;

  try {
    // Step 1: create prediction
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "db21e45f9c2b8d3c3c0c9f2b8a2b5a1c",
        input: {
          prompt: `realistic handwritten note on notebook paper, neat cursive handwriting, blue ink: ${text}`
        }
      })
    });

    const data = await response.json();

    // Step 2: wait until image ready
    let result;
    while (true) {
      const check = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
        headers: {
          "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`
        }
      });

      result = await check.json();

      if (result.status === "succeeded") break;

      if (result.status === "failed") {
        return res.status(500).json({ error: "Generation failed" });
      }

      await new Promise(r => setTimeout(r, 2000));
    }

    // Step 3: send image
    return res.json({
      image: result.output[0]
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
