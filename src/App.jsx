import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

  // Initialize Gemini AI
  const initializeAI = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Please add your Gemini API key to the .env file');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  };

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Calculate word count and reading time
  useEffect(() => {
    if (content) {
      const words = content.trim().split(/\s+/).length;
      setWordCount(words);
      setReadingTime(Math.ceil(words / 200)); // 200 words per minute
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
    const prompts = {
      formal: "Write a formal and professional blog post with proper structure, academic tone, and authoritative language. Use clear headings, professional terminology, and maintain a serious, informative style throughout.",
      casual: "Write a friendly and conversational blog post as if you're talking to a close friend. Use simple language, personal anecdotes, contractions, and an approachable tone that makes complex topics easy to understand.",
      seo: "Write an SEO-optimized blog post using relevant keywords naturally throughout the content. Include proper headings (H1, H2, H3), meta-friendly structure, keyword-rich introductions and conclusions, and ensure the content is search engine friendly while remaining readable."
    };
    return prompts[selectedTone];
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
      const model = initializeAI();
      const prompt = `${getTonePrompt(tone)}\n\nTopic: ${topic}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setContent(text);
    } catch (err) {
      setError(err.message || 'Failed to generate content. Please check your API key and try again.');
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
                  AI BlogWriter
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
                    type="text"
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
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
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