import { useState, useCallback, useEffect } from "react";
import * as authService from "../auth/authService";
import * as adminService from "../services/adminService";
import * as certificateService from "../services/certificateService";

// Generic create/edit/delete/(optional reorder) over one of adminService's
// resource collections — shared by courses/lessons/quizzes/achievements
// instead of writing the same wiring four times. Loads itself on mount
// (Firestore reads are async, unlike the old synchronous localStorage
// reads this replaced), so admin pages don't need their own loading
// useEffect the way the Users page still does for authService.
function useResourceCrud(getAll, api) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const all = await getAll();
    setItems(all);
    setIsLoading(false);
    return all;
  }, [getAll]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (item) => {
      await api.create(item);
      await refresh();
    },
    [api, refresh]
  );

  const edit = useCallback(
    async (id, updates) => {
      await api.update(id, updates);
      await refresh();
    },
    [api, refresh]
  );

  const remove = useCallback(
    async (id) => {
      await api.delete(id);
      await refresh();
    },
    [api, refresh]
  );

  const reorder = useCallback(
    async (id, direction) => {
      if (!api.reorder) return;

      const current = await getAll();
      const index = current.findIndex((entry) => entry.id === id);
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= current.length) return;

      const reordered = [...current];
      [reordered[index], reordered[swapIndex]] = [
        reordered[swapIndex],
        reordered[index],
      ];
      await api.reorder(reordered.map((entry) => entry.id));
      setItems(reordered);
    },
    [api, getAll]
  );

  return { items, isLoading, add, edit, remove, reorder, refresh };
}

export default function useAdmin() {
  const [users, setUsers] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [settings, setSettings] = useState(adminService.DEFAULT_SETTINGS);
  const [certificateTemplate, setCertificateTemplate] = useState(
    adminService.DEFAULT_CERTIFICATE_TEMPLATE
  );

  useEffect(() => {
    adminService.getSettings().then(setSettings);
    adminService.getCertificateTemplate().then(setCertificateTemplate);
  }, []);

  const refreshUsers = useCallback(async () => {
    const all = await authService.getAllUsers();
    setUsers(all);
    return all;
  }, []);

  const refreshCertificates = useCallback(async () => {
    const all = await certificateService.getAllCertificates();
    setCertificates(all);
    return all;
  }, []);

  const changeUserRole = useCallback(
    async (userId, role) => {
      await authService.updateUserRole(userId, role);
      await refreshUsers();
    },
    [refreshUsers]
  );

  const setUserActiveStatus = useCallback(
    async (userId, active) => {
      await authService.setUserActive(userId, active);
      await refreshUsers();
    },
    [refreshUsers]
  );

  const editUserProfile = useCallback(
    async (userId, updates) => {
      await authService.updateAccount(userId, updates);
      await refreshUsers();
    },
    [refreshUsers]
  );

  const courses = useResourceCrud(adminService.getCourses, {
    create: adminService.createCourse,
    update: adminService.updateCourse,
    delete: adminService.deleteCourse,
    reorder: adminService.reorderCourses,
  });

  const lessons = useResourceCrud(adminService.getLessons, {
    create: adminService.createLesson,
    update: adminService.updateLesson,
    delete: adminService.deleteLesson,
    reorder: adminService.reorderLessons,
  });

  const quizzes = useResourceCrud(adminService.getQuizzes, {
    create: adminService.createQuiz,
    update: adminService.updateQuiz,
    delete: adminService.deleteQuiz,
  });

  const achievements = useResourceCrud(adminService.getAdminAchievements, {
    create: adminService.createAchievement,
    update: adminService.updateAchievement,
    delete: adminService.deleteAchievement,
  });

  const editSettings = useCallback(async (updates) => {
    setSettings(await adminService.updateSettings(updates));
  }, []);

  const editCertificateTemplate = useCallback(async (updates) => {
    setCertificateTemplate(await adminService.updateCertificateTemplate(updates));
  }, []);

  const uploadLogo = useCallback(async (file) => {
    const logoUrl = await adminService.uploadLogo(file);
    setSettings(await adminService.updateSettings({ logoUrl }));
    return logoUrl;
  }, []);

  const uploadCourseThumbnail = useCallback(
    (file) => adminService.uploadCourseThumbnail(file),
    []
  );

  return {
    users,
    refreshUsers,
    changeUserRole,
    setUserActiveStatus,
    editUserProfile,

    certificates,
    refreshCertificates,

    courses,
    lessons,
    quizzes,
    achievements,

    settings,
    editSettings,
    uploadLogo,
    uploadCourseThumbnail,

    certificateTemplate,
    editCertificateTemplate,
  };
}
