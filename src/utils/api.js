 const API_KEY = import.meta.env.API_KEY;
const SITE_URL = import.meta.env.SITE_URL
const SITE_NAME = import.meta.env.SITE_NAME || "My BlogWriter AI";

const getTonePrompt = (topic, selectedTone) => {
  const baseGuidelines = `
You are an expert blog writer and content strategist with years of experience creating viral, engaging, and SEO-optimized blog posts. Your writing style is authentic, human, and compelling.

Write a comprehensive, well-structured blog post on the topic: "${topic}"

CONTENT REQUIREMENTS:
1. Word Count: Maximum 250 words (aim for 200-250 words for optimal engagement)

2. INTRODUCTION (First 2-3 sentences):
   - Start with a compelling hook: a surprising fact, a thought-provoking question, a relatable scenario, or a bold statement
   - Immediately establish the value proposition - why should the reader care?
   - Create curiosity that makes them want to continue reading
   - Avoid generic openings like "In today's world" or "Have you ever wondered"

3. BODY STRUCTURE:
   - Use 2-3 clear, descriptive subheadings that break down the main points
   - Each paragraph should be 2-4 sentences maximum (keep it scannable)
   - Use transition words naturally to create flow (however, moreover, for instance, similarly)
   - Include specific examples, statistics, or real-world applications when relevant
   - Use bullet points or numbered lists for key takeaways or actionable items
   - Vary sentence length - mix short punchy sentences with longer explanatory ones

4. CONTENT QUALITY:
   - Write in an active voice (prefer "We discovered" over "It was discovered")
   - Use power words and vivid language that creates mental images
   - Include storytelling elements: brief anecdotes, scenarios, or case studies
   - Add analogies and metaphors to explain complex concepts simply
   - Make it relatable by connecting to readers' experiences, challenges, or aspirations
   - Provide actionable insights, tips, or takeaways

5. SEO OPTIMIZATION:
   - Naturally incorporate the main topic keyword and related terms throughout
   - Use semantic variations and LSI keywords organically
   - Include the topic keyword in the first paragraph
   - Create descriptive subheadings that include relevant keywords
   - Avoid keyword stuffing - prioritize readability and natural flow
   - Write for humans first, search engines second

6. CONCLUSION (Last 2-3 sentences):
   - Summarize the key points without repeating verbatim
   - End with a strong takeaway or memorable statement
   - Include a clear call-to-action when appropriate (e.g., "Try this today", "Share your thoughts", "Explore more")
   - Leave the reader with value and a sense of completion

7. WRITING STYLE:
   - Use a conversational, human-like tone as if explaining to an intelligent friend
   - Avoid AI-sounding phrases: "As an AI", "In conclusion", "In summary", "It's important to note that"
   - Eliminate filler words and phrases: "very", "really", "quite", "basically", "essentially"
   - Use contractions naturally (don't, can't, it's) to sound more human
   - Write at a grade 8-10 reading level - accessible but not condescending
   - Maintain consistent tense throughout (prefer present tense for most blog posts)

8. FORMATTING RULES:
   - Do NOT use markdown formatting: no asterisks (*), double asterisks (**), hash symbols (#), or markdown syntax
   - Do NOT use hyphens (-) for bullet points - use plain text bullets (•) or numbers
   - Write subheadings as plain text, not markdown headers
   - Use line breaks between paragraphs for readability
   - Keep formatting clean and simple - ready for direct publishing

9. ENGAGEMENT TECHNIQUES:
   - Ask rhetorical questions to engage readers
   - Use "you" to speak directly to the reader
   - Include emotional triggers: curiosity, urgency, relatability, aspiration
   - Create a sense of discovery or revelation
   - Make complex topics accessible through simple explanations

10. AUTHENTICITY:
    - Write as if you have personal experience or deep knowledge of the topic
    - Use specific details rather than vague generalizations
    - Show, don't just tell - use examples and evidence
    - Be genuine and avoid overly promotional language
    - Write with confidence and authority

OUTPUT FORMAT:
- Start directly with the introduction (no title needed)
- Use clear paragraph breaks
- Include subheadings as plain text (not markdown)
- End with a strong conclusion
- The entire post should be ready to publish as-is

Remember: Your goal is to create content that readers will actually want to read, share, and remember. Quality over quantity - every word should add value.
`;

  const tones = {
    formal: `
TONE SPECIFICATIONS - FORMAL:
- Use professional, authoritative language while remaining accessible
- Employ sophisticated vocabulary appropriately (not overly complex)
- Maintain a respectful, business-appropriate tone
- Use complete sentences and proper grammar throughout
- Avoid slang, colloquialisms, or overly casual expressions
- Structure content logically with clear, professional transitions
- Present information with confidence and expertise
- Suitable for: business blogs, professional publications, academic audiences, corporate content`,
    
    casual: `
TONE SPECIFICATIONS - CASUAL:
- Write as if chatting with a friend over coffee
- Use everyday language that feels natural and relatable
- Incorporate conversational phrases and friendly expressions
- Feel free to use contractions liberally (don't, can't, we're, it's)
- Use "you" and "we" frequently to create connection
- Include light humor, personal touches, and relatable moments
- Keep sentences shorter and more conversational
- Use simple, clear language - no jargon unless explained
- Suitable for: lifestyle blogs, personal blogs, social media content, general audiences`,
    
    seo: `
TONE SPECIFICATIONS - SEO-FRIENDLY:
- Balance natural readability with strategic keyword placement
- Use the main topic keyword in the first paragraph naturally
- Incorporate related keywords and semantic variations throughout
- Create subheadings that include target keywords when possible
- Use question-based subheadings (What is X? How does X work?)
- Include long-tail keywords and phrases naturally
- Structure content to answer common search queries
- Use internal linking opportunities (mention related topics)
- Include FAQ-style sections when relevant
- Maintain readability - never sacrifice user experience for keywords
- Suitable for: content marketing, SEO-focused blogs, search-driven content`
  };

  return `${baseGuidelines}\n\n${tones[selectedTone]}\n\nNow, write the blog post on "${topic}" following all the guidelines above.`;
};

export const generateBlogContent = async (topic, tone) => {
  if (!topic.trim()) {
    throw new Error('Please enter a blog topic');
  }

  const prompt = getTonePrompt(topic, tone);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": SITE_URL,
      "X-Title": SITE_NAME,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b:free",
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error("Failed to generate content");
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "No response from AI.";
};

