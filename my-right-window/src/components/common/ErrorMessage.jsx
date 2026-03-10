export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h3 className="text-xl font-bold text-red-500 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}