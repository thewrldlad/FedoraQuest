import { useState, useEffect, useCallback } from "react";
import useAuth from "../auth/useAuth";
import * as profileService from "../services/profileService";

// Sources profile data from the authenticated user's Firestore document
// (via profileService, through authService/useAuth) instead of an
// independent localStorage key — previously useProfile and authService
// each kept their own separate copy of fullName/username/email, which
// could silently drift out of sync. Now there is exactly one profile
// document per account, and this hook is just a read/write view over it.
export const DEFAULT_PROFILE = {
  fullName: "",
  username: "",
  email: "",
  bio: "",
  avatarUrl: "",
  learningLevel: "Linux Beginner",
};

export default function useProfile() {
  const { user, updateAccount } = useAuth();
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(DEFAULT_PROFILE);
      setIsLoading(false);
      return;
    }

    setProfile({
      fullName: user.fullName || "",
      username: user.username || "",
      email: user.email || "",
      bio: user.bio || "",
      avatarUrl: user.photoURL || "",
      learningLevel: user.learningLevel || DEFAULT_PROFILE.learningLevel,
    });
    setIsLoading(false);
  }, [user]);

  // Avatar changes go through uploadAvatar/removeAvatar below (which
  // touch Firebase Storage, not just the Firestore text fields) — this
  // generic updater is for the rest of the profile form only.
  const updateProfile = useCallback(
    async (updates) => {
      if (!user) return;
      const { avatarUrl, ...rest } = updates;
      void avatarUrl;
      await updateAccount(rest);
    },
    [user, updateAccount]
  );

  const uploadAvatar = useCallback(
    async (file) => {
      if (!user) return null;
      const url = await profileService.uploadAvatar(user.uid, file);
      setProfile((current) => ({ ...current, avatarUrl: url }));
      return url;
    },
    [user]
  );

  const removeAvatar = useCallback(async () => {
    if (!user) return;
    await profileService.deleteAvatar(user.uid);
    setProfile((current) => ({ ...current, avatarUrl: "" }));
  }, [user]);

  return { profile, updateProfile, uploadAvatar, removeAvatar, isLoading };
}
