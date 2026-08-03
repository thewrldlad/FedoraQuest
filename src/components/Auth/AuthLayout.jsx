export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-fedora-bg px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-md flex items-center justify-center bg-fedora-accent">
            <span className="text-sm font-semibold text-white font-display">
              F
            </span>
          </div>
          <span className="font-medium text-lg tracking-tight text-fedora-text font-display">
            Fedora Quest
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
