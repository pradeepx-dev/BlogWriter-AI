import React, { useState, useEffect } from 'react';
import { Moon, Sun, Copy, Download, RefreshCw, BookOpen, Clock, Hash } from 'lucide-react';

const App = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('formal');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY; // Put in .env
  const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173"; 
  const SITE_NAME = import.meta.env.VITE_SITE_NAME || "My BlogWriter AI"; 

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Calculate word count + reading time
  useEffect(() => {
    if (content) {
      const words = content.trim().split(/\s+/).length;
      setWordCount(words);
      setReadingTime(Math.ceil(words / 200));
    } else {
      setWordCount(0);
      setReadingTime(0);
    }
  }, [content]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const getTonePrompt = (selectedTone) => {
    const baseGuidelines = `
You are an expert blog writer who creates engaging, easy-to-read, and SEO-friendly content.  
Write a blog post on the topic \`${topic}\` in maximum 250 words.

Requirements:  
1. Use a conversational and human-like tone, as if explaining to a friend.  
2. Structure the blog with:  
   • An engaging introduction that hooks the reader  
   • Clear subheadings 
   • Short paragraphs (2–4 lines each)  
   • Bullet points or numbered lists where useful  
3. Avoid AI-sounding language like "As an AI" or repetitive phrasing.  
4. Add examples, analogies, or simple real-life references to make it relatable.  
5. Make it SEO-friendly by naturally including relevant keywords without keyword stuffing.  
6. End with a strong conclusion and, if suitable, a call-to-action.  
7. Keep grammar clean and ensure readability for a general audience at grade 6–8 reading level.
8. Do not include asterisks (*) and double asterisks (**), hash symbols (#), hyphens (-), or inline comments in the output.    

Output should be a well-formatted blog post ready for publishing.
`;
  
    const tones = {
      formal: "Maintain a professional and structured tone.",
      casual: "Keep it friendly, simple, and conversational.",
      seo: "Focus on keyword-rich, search-friendly structure while staying natural."
    };
  
    return `${baseGuidelines}\n\nTone Style: ${tones[selectedTone]}`;
  };
  
  const generateContent = async () => {
    if (!topic.trim()) {
      setError('Please enter a blog topic');
      return;
    }
  
    setLoading(true);
    setError('');
    setContent('');
  
    try {
      const prompt = getTonePrompt(tone).replace("{insert topic here}", topic);
  
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": import.meta.env.SITE_URL,
          "X-Title": import.meta.env.SITE_NAME,
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
      const text = data.choices[0]?.message?.content || "No response from AI.";
  
      setContent(text);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const downloadContent = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `blog-${topic.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toneOptions = [
    { value: 'formal', label: 'Formal', icon: '🎓' },
    { value: 'casual', label: 'Casual', icon: '😊' },
    { value: 'seo', label: 'SEO-Friendly', icon: '🔍' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  BlogWriter AI
                </h1>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Generate Your Blog Content
                </h2>
                
                {/* Topic Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Blog Topic
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter your blog topic (e.g., 'Benefits of Remote Work')"
                    className="w-full h-[8rem] resize-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  ></textarea>
                </div>

                {/* Tone Selector */}
                <div className="space-y-2 mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Writing Tone
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {toneOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTone(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          tone === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-xl mb-1">{option.icon}</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {option.label}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateContent}
                  disabled={loading || !topic.trim()}
                  className="w-full mt-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-5 w-5" />
                      <span>Generate Blog Content</span>
                    </>
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <div className="text-center mt-4 pt-1 border-t border-blue-400 ">
                  <p className="text-sm text-gray-200">
                    © {new Date().getFullYear()} BlogWriter AI. Created by{' '}
                    <a
                      href="https://github.com/pradeepx-dev"
                      className="hover:text-blue-200 transition-colors text-blue-400"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      pradeepx-dev
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              {/* Stats */}
              {content && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mb-1">
                        <Hash className="h-4 w-4" />
                        <span className="text-sm">Words</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {wordCount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mb-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Read Time</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {readingTime} min
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Output */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Generated Content
                    </h3>
                    {content && (
                      <div className="flex space-x-2">
                        <button
                          onClick={copyToClipboard}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy className="h-5 w-5" />
                        </button>
                        <button
                          onClick={downloadContent}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Download as text file"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                  {copySuccess && (
                    <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                      Content copied to clipboard!
                    </p>
                  )}
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="space-y-4">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      </div>
                    </div>
                  ) : content ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-sans text-sm leading-relaxed">
                        {content}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Enter a topic and click "Generate Blog Content" to get started
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
