const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// API endpoint and API key from environment variables
const MODEL_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const API_KEY = "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";

// Endpoint to handle chat messages
app.post('/chat', async (req, res) => {
  const userMessage = req.body.user_message;

  try {
    // Send a request to the NVIDIA model API with the required payload
    const response = await axios.post(
      MODEL_API_URL,
      {
        model: "nvidia/llama-3.1-nemotron-70b-instruct", // Update with your model name
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.5,
        top_p: 1,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response contains the expected data
    if (response.data && response.data.choices && response.data.choices[0]) {
      res.json({ response: response.data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "No valid response from the model" });
    }

  } catch (error) {
    console.error("Error making API request:", error.message);
    res.status(500).json({ error: "Failed to get response from model API" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
