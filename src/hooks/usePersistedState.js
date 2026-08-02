import { useState, useEffect } from "react";

// Generic localStorage-backed state. Defaults assume JSON-serializable
// values; pass serialize/deserialize for plain strings/numbers, and
// shouldPersist to guard writes (e.g. skip persisting an empty value).
export default function usePersistedState(key, defaultValue, options = {}) {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    shouldPersist = () => true,
  } = options;

  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? deserialize(saved) : defaultValue;
  });

  // Intentionally depends only on `value`, matching the original
  // per-key effects this hook replaces (each ran off a single value).
  useEffect(() => {
    if (shouldPersist(value)) {
      localStorage.setItem(key, serialize(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [value, setValue];
}
