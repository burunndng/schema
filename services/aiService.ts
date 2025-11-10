const OPENROUTER_API_KEY_KEY = 'burundanga_openrouter_key';

export const aiService = {
  // Get stored API key
  getApiKey: (): string | null => {
    return localStorage.getItem(OPENROUTER_API_KEY_KEY);
  },

  // Set API key
  setApiKey: (key: string) => {
    localStorage.setItem(OPENROUTER_API_KEY_KEY, key);
  },

  // Generate a forum post
  generatePost: async (
    botName: string,
    category: string,
    context?: string
  ): Promise<{ title: string; content: string } | null> => {
    const apiKey = aiService.getApiKey();
    if (!apiKey) return null;

    const botPersonalities: { [key: string]: string } = {
      'bot_ada': 'Dr. Ada - a witty Schema Therapy expert with dry humor and clever insights',
      'bot_casey': 'Curious Casey - an enthusiastic learner who finds relatable, funny aspects in everything',
      'bot_ray': 'Recovery Ray - shares hopeful, humorous success stories and encouraging anecdotes',
      'bot_sam': 'Skeptic Sam - a playfully cynical devil\'s advocate who roasts common therapy tropes with humor',
    };

    const prompt = `You are ${botPersonalities[botName] || botName}, a witty member of the Burundanga Schema Therapy forum.

Generate a FUNNY, engaging forum post for the "${category}" category that:
- Has a clever, punchy title with a bit of humor or wordplay
- Is 2-3 sentences of witty, relatable content
- Shows personality and character-appropriate humor
- Is relevant to schema therapy or personal growth
- Makes other forum members smile or chuckle
${context ? `\nContext: ${context}` : ''}

Return ONLY valid JSON with exactly this format:
{"title": "post title", "content": "post content"}`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-v3.2-exp',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        console.error('OpenRouter API error:', response.statusText);
        return null;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      // Parse JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: parsed.title || 'Untitled Discussion',
        content: parsed.content || 'No content',
      };
    } catch (error) {
      console.error('Error generating post:', error);
      return null;
    }
  },

  // Generate a reply with humor
  generateReply: async (postTitle: string, postContent: string, botName: string): Promise<string | null> => {
    const apiKey = aiService.getApiKey();
    if (!apiKey) return null;

    const botPersonalities: { [key: string]: string } = {
      'bot_ada': 'Dr. Ada - a witty Schema Therapy expert who makes clever observations with dry humor',
      'bot_casey': 'Curious Casey - an enthusiastic learner who finds things hilariously relatable and funny',
      'bot_ray': 'Recovery Ray - someone who loves sharing hopeful, funny anecdotes about personal growth',
      'bot_sam': 'Skeptic Sam - a playfully cynical devil\'s advocate who roasts ideas with humor',
    };

    const prompt = `You are ${botPersonalities[botName] || 'a forum member'} on the Burundanga Schema Therapy forum.

Someone posted:
Title: "${postTitle}"
Content: "${postContent}"

Write a FUNNY, sarcastic, witty reply (1-2 sentences max) that:
- Makes a humorous observation or joke about what they said
- Is playfully teasing but still supportive and relevant to schema therapy
- Uses wit, sarcasm, or absurdist humor
- Shows personality and character-appropriate humor

Be brief, punchy, and make them laugh!
Return ONLY the reply text, no JSON or formatting.`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-v3.2-exp',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 100,
        }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    } catch (error) {
      console.error('Error generating reply:', error);
      return null;
    }
  },
};
