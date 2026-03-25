export default async function handler(req, res) {
  try {
    const { text } = req.body;

    // Step 1: create prediction
    const start = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "db21e45b9d3e8b3b6e7c0dce274164a491091696e4d3ef1d6400ed1d5d295dfc",
        input: {
          prompt: `realistic handwritten notes on notebook paper, blue ink pen, neat cursive handwriting: ${text}`
        }
      })
    });

    let prediction = await start.json();

    // Step 2: wait until complete
    while (prediction.status !== "succeeded") {
      await new Promise(r => setTimeout(r, 2000));

      const check = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`
        }
      });

      prediction = await check.json();
    }

    // Step 3: send image
    res.status(200).json({
      image: prediction.output[0]
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to generate image" });
  }
}
