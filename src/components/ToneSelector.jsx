import { CheckCircle2 } from 'lucide-react';

const toneOptions = [
  { value: 'formal', label: 'Formal', icon: '🎓', description: 'Professional & structured' },
  { value: 'casual', label: 'Casual', icon: '😊', description: 'Friendly & conversational' },
  { value: 'seo', label: 'SEO-Friendly', icon: '🔍', description: 'Keyword-optimized' }
];

const ToneSelector = ({ tone, setTone }) => {
  return (
    <div className="space-y-3 mb-8">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        Writing Tone
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {toneOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTone(option.value)}
            className={`group relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              tone === option.value
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 shadow-lg shadow-blue-500/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900/50'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">
                {option.icon}
              </div>
              <div className={`text-sm font-semibold mb-1 ${
                tone === option.value
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {option.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {option.description}
              </div>
            </div>
            {tone === option.value && (
              <div className="absolute top-2 right-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToneSelector;

