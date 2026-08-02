import usePersistedState from "./usePersistedState";

// Editable profile fields, kept separate from GameContext's progress state.
// This is the seam for a future backend swap (Firebase/Supabase, etc.):
// components only ever call useProfile() and get back { profile,
// updateProfile } — nothing about them needs to change if what's inside
// this hook changes from localStorage to a remote store.
export const DEFAULT_PROFILE = {
  fullName: "The Wrld Lad",
  username: "thewrldlad",
  email: "",
  bio: "Learning Fedora Linux one lesson at a time.",
  avatarUrl: "",
  learningLevel: "Linux Beginner",
};

export default function useProfile() {
  const [profile, setProfile] = usePersistedState(
    "profileData",
    DEFAULT_PROFILE
  );

  const updateProfile = (updates) => {
    setProfile((current) => ({ ...current, ...updates }));
  };

  return { profile, updateProfile };
}
