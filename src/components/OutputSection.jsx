import { Copy, Download, CheckCircle2 } from 'lucide-react';
import StatsCards from './StatsCard';
import ContentDisplay from './ContentDisplay';

const OutputSection = ({ content, loading, wordCount, readingTime, copySuccess, onCopy, onDownload }) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards wordCount={wordCount} readingTime={readingTime} />

      {/* Content Output Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
        <div className="relative backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-900/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Generated Content
              </h3>
              {content && (
                <div className="flex space-x-2">
                  <button
                    onClick={onCopy}
                    className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-110 active:scale-95"
                    title="Copy to clipboard"
                  >
                    {copySuccess ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={onDownload}
                    className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 transform hover:scale-110 active:scale-95"
                    title="Download as text file"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
            {copySuccess && (
              <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-in slide-in-from-top">
                <p className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Content copied to clipboard!</span>
                </p>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="p-6 lg:p-8 min-h-[400px] max-h-[600px] overflow-y-auto custom-scrollbar">
            <ContentDisplay loading={loading} content={content} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputSection;

