import React, { useState } from 'react';
import Background from './components/Background';
import Header from './components/Header';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import Footer from './components/Footer';
import useTheme from './hooks/useTheme';
import useContentStats from './hooks/useContentStats';
import { generateBlogContent } from './utils/api';
import { copyToClipboard, downloadContent } from './utils/contentUtils';

const App = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('formal');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const { darkMode, toggleTheme } = useTheme();
  const { wordCount, readingTime } = useContentStats(content);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setContent('');

    try {
      const generatedContent = await generateBlogContent(topic, tone);
      setContent(generatedContent);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownload = () => {
    downloadContent(content, topic);
  };

  return (
    <div className="min-h-screen transition-all duration-500">
      <Background />
      <Header darkMode={darkMode} toggleTheme={toggleTheme} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <InputSection
            topic={topic}
            setTopic={setTopic}
            tone={tone}
            setTone={setTone}
            loading={loading}
            error={error}
            onGenerate={handleGenerate}
          />
          <OutputSection
            content={content}
            loading={loading}
            wordCount={wordCount}
            readingTime={readingTime}
            copySuccess={copySuccess}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
