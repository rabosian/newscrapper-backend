const SUGGESTION_STYLE =
  "Rewrite the text from the prompt in the same language used, improving it to be friendly and engaging. Don't add any extra words—just focus on the prompt's intent and make it beautiful.";

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const OPEN_AI_API_KEY = process.env.OPEN_AI_KEY;

export const commentAI = async (req, res) => {
  try {
    const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY });
    const { comment } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SUGGESTION_STYLE },
        {
          role: 'user',
          content: comment,
        },
      ],
    });
    const suggestedComment = completion.choices[0].message;
    res.status(200).json({ suggestedComment });
  } catch (error) {
    res.status(400).json({ error: 'failed', error: error });
  }
};
