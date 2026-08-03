import { useState, useCallback } from "react";
import * as authService from "../auth/authService";
import * as adminService from "../services/adminService";

// Generic create/edit/delete/(optional reorder) over one of adminService's
// resource collections — shared by courses/lessons/quizzes/achievements
// instead of writing the same wiring four times.
function useResourceCrud(getAll, api) {
  const [items, setItems] = useState(() => getAll());

  const refresh = useCallback(() => setItems(getAll()), [getAll]);

  const add = useCallback(
    (item) => {
      api.create(item);
      refresh();
    },
    [api, refresh]
  );

  const edit = useCallback(
    (id, updates) => {
      api.update(id, updates);
      refresh();
    },
    [api, refresh]
  );

  const remove = useCallback(
    (id) => {
      api.delete(id);
      refresh();
    },
    [api, refresh]
  );

  const reorder = useCallback(
    (id, direction) => {
      if (!api.reorder) return;

      const current = getAll();
      const index = current.findIndex((entry) => entry.id === id);
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= current.length) return;

      const reordered = [...current];
      [reordered[index], reordered[swapIndex]] = [
        reordered[swapIndex],
        reordered[index],
      ];
      api.reorder(reordered.map((entry) => entry.id));
      setItems(reordered);
    },
    [api, getAll]
  );

  return { items, add, edit, remove, reorder, refresh };
}

export default function useAdmin() {
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState(() => adminService.getSettings());
  const [certificateTemplate, setCertificateTemplate] = useState(() =>
    adminService.getCertificateTemplate()
  );

  const refreshUsers = useCallback(async () => {
    const all = await authService.getAllUsers();
    setUsers(all);
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

  const editSettings = useCallback((updates) => {
    setSettings(adminService.updateSettings(updates));
  }, []);

  const editCertificateTemplate = useCallback((updates) => {
    setCertificateTemplate(adminService.updateCertificateTemplate(updates));
  }, []);

  return {
    users,
    refreshUsers,
    changeUserRole,
    setUserActiveStatus,
    editUserProfile,

    courses,
    lessons,
    quizzes,
    achievements,

    settings,
    editSettings,

    certificateTemplate,
    editCertificateTemplate,
  };
}
