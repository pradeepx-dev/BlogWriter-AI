const Footer = () => {
  return (
    <footer className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} BlogWriter AI. Created by{' '}
            <a
              href="https://github.com/pradeepx-dev"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              pradeepx-dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

