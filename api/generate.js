export default async function handler(req, res) {

  const text = req.body.text;

  const prompt = "realistic handwritten notes on notebook paper, blue ink, cursive handwriting: " + text;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_HF_TOKEN",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    }
  );

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  res.status(200).json({
    image: `data:image/png;base64,${base64}`
  });
}
