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

    const prompt = `You are ${botName}, a member of the Burundanga Schema Therapy forum.
Generate a realistic forum post for the "${category}" category.
${context ? `Context: ${context}` : ''}

Keep it concise (2-3 sentences), relevant to schema therapy, and authentic.
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
          model: 'meta-llama/llama-2-7b-chat',
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

  // Generate a reply
  generateReply: async (postTitle: string, botName?: string): Promise<string | null> => {
    const apiKey = aiService.getApiKey();
    if (!apiKey) return null;

    const prompt = `You are a thoughtful member of the Burundanga Schema Therapy forum.
Someone posted: "${postTitle}"

Write a helpful, brief reply (1-2 sentences) that adds value to the discussion.
Be authentic and empathetic.
Return ONLY the reply text, no JSON or formatting.`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-2-7b-chat',
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
