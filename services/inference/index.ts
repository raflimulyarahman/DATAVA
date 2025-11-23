import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5052;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'DATAVA Inference Service', status: 'running' });
});

// Inference endpoint
app.post('/infer', async (req: Request, res: Response) => {
  try {
    const { input, poolId, metadata } = req.body;

    if (!input) {
      return res.status(400).json({ error: 'Input prompt is required' });
    }

    console.log(`Processing inference request for pool: ${poolId}`);

    // Get OpenAI API key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment variables');
      return res.status(500).json({ error: 'Server configuration error: API key missing' });
    }

    // Get model and system prompt from environment
    const model = process.env.MODEL || 'gpt-4o'; // Using gpt-4o which is a real model
    const systemPrompt = process.env.SYSTEM_PROMPT || 'You are DATAVA cooperative model. Answer concisely.';

    // Make actual call to OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 50000, // 50 seconds timeout
      }
    );

    const completion = response.data.choices[0].message.content;
    const tokensUsed = response.data.usage?.total_tokens || completion?.split(' ').length || 0;

    console.log(`Inference completed for pool: ${poolId}, tokens used: ${tokensUsed}`);

    res.json({
      text: completion,
      tokens: tokensUsed,
      model: model,
      poolId: poolId
    });
  } catch (error: any) {
    console.error('Inference error:', error.message || error);

    // If OpenAI call fails, return error response
    if (error.response) {
      // OpenAI API error
      res.status(500).json({
        error: 'Inference failed',
        details: `OpenAI API error: ${error.response.data?.error?.message || error.message}`
      });
    } else if (error.request) {
      // Network error
      res.status(500).json({
        error: 'Inference failed',
        details: 'Network error: unable to connect to OpenAI API'
      });
    } else {
      // Other errors
      res.status(500).json({
        error: 'Inference failed',
        details: error.message || 'Unknown error occurred'
      });
    }
  }
});

app.listen(port, () => {
  console.log(`DATAVA Inference Service running on port ${port}`);
  console.log(`Model: ${process.env.MODEL || 'gpt-4o'}`);
  console.log(`System prompt: ${process.env.SYSTEM_PROMPT || 'You are DATAVA cooperative model. Answer concisely.'}`);
});