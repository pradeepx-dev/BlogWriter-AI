import { Moon, Sun } from 'lucide-react';

const Header = ({ darkMode, toggleTheme }) => {
  return (
    <header className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              BlogWriter AI
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by AI</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleTheme();
            }}
            className="relative p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
            aria-label="Toggle theme"
            type="button"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

