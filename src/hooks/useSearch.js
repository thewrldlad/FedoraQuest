import { useMemo, useState } from "react";
import searchIndex from "../data/searchIndex";

export default function useSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const search = query.toLowerCase();

    return searchIndex
      .filter((item) => item.keywords.includes(search))
      .slice(0, 8);
  }, [query]);

  return {
    query,
    setQuery,
    results,
  };
}
