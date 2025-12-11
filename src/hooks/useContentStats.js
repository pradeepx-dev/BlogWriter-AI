import { useState, useEffect } from 'react';

const useContentStats = (content) => {
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

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

  return { wordCount, readingTime };
};

export default useContentStats;

