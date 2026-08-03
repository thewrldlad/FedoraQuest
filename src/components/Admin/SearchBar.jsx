import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="flex items-center gap-2 bg-fedora-bg border border-fedora-border rounded-lg px-4 py-2.5">
      <Search size={16} className="text-fedora-muted shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none text-fedora-text placeholder:text-fedora-muted w-full text-sm"
      />
    </div>
  );
}
