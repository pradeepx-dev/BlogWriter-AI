import { RefreshCw } from 'lucide-react';
import ToneSelector from './ToneSelector';

const InputSection = ({ topic, setTopic, tone, setTone, loading, error, onGenerate }) => {
  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
        <div className="relative backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Create Your Blog
          </h2>
          
          {/* Topic Input */}
          <div className="space-y-3 mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Blog Topic
            </label>
            <div className="relative">
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What would you like to write about? (e.g., 'The Future of Remote Work')"
                className="w-full h-32 resize-none px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
              ></textarea>
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {topic.length} characters
              </div>
            </div>
          </div>

          {/* Tone Selector */}
          <ToneSelector tone={tone} setTone={setTone} />

          {/* Generate Button */}
          <button
            onClick={onGenerate}
            disabled={loading || !topic.trim()}
            className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 shadow-lg shadow-blue-500/30 disabled:shadow-none flex items-center justify-center space-x-3"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            {loading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <span>Generate Blog Content</span>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl animate-in slide-in-from-top">
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputSection;

