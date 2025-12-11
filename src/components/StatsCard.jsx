import { Hash, Clock } from 'lucide-react';

const StatsCard = ({ icon: Icon, label, value, gradientFrom, gradientTo, darkGradientFrom, darkGradientTo }) => {
  const darkFrom = darkGradientFrom || gradientFrom.replace('from-', 'dark:from-');
  const darkTo = darkGradientTo || gradientTo.replace('to-', 'dark:to-');
  
  return (
    <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5 text-center">
      <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className={`text-3xl font-bold bg-gradient-to-r ${gradientFrom} ${gradientTo} ${darkFrom} ${darkTo} bg-clip-text text-transparent`}>
        {value}
      </div>
    </div>
  );
};

const StatsCards = ({ wordCount, readingTime }) => {
  if (!wordCount && !readingTime) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatsCard
        icon={Hash}
        label="Words"
        value={wordCount.toLocaleString()}
        gradientFrom="from-blue-600"
        gradientTo="to-purple-600"
        darkGradientFrom="dark:from-blue-400"
        darkGradientTo="dark:to-purple-400"
      />
      <StatsCard
        icon={Clock}
        label="Read Time"
        value={`${readingTime}s`}
        gradientFrom="from-purple-600"
        gradientTo="to-pink-600"
        darkGradientFrom="dark:from-purple-400"
        darkGradientTo="dark:to-pink-400"
      />
    </div>
  );
};

export default StatsCards;

