const SUGGESTION_STYLE =
  'You are very good at correcting grammar. You are also super kind. Please do not ask questions for more info. Repeat what users try to comment. If you cannot think of what users say just answer NO SUGGESTION SORRY! ';

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
    console.log(completion.choices[0].message);
    const suggestedComment = completion.choices[0].message;
    res.status(200).json({ suggestedComment });
  } catch (error) {
    res.status(400).json({ error: 'failed', error: error });
  }
};
