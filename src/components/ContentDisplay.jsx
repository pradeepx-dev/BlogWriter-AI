const LoadingSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className={`h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg ${i % 2 === 0 ? 'w-3/4' : 'w-full'}`}></div>
          {i % 3 === 0 && (
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-5/6"></div>
          )}
        </div>
      ))}
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Ready to Create?
      </h4>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
        Enter a topic and choose your writing tone, then click "Generate Blog Content" to get started
      </p>
    </div>
  );
};

const ContentDisplay = ({ loading, content }) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (content) {
    return (
      <div className="prose dark:prose-invert max-w-none">
        <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-sans text-base leading-relaxed">
          {content}
        </pre>
      </div>
    );
  }

  return <EmptyState />;
};

export default ContentDisplay;

