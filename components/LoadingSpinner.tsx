export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-coffee-200 border-t-coffee-600 rounded-full animate-spin" />
      </div>
      <p className="text-sm text-coffee-400 animate-pulse">
        Kaffees werden geladen...
      </p>
    </div>
  );
}