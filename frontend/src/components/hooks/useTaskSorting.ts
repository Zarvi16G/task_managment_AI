// hooks/useTaskSorting.ts
import { useState, useMemo } from "react";
import type { Task } from "../types/Task";

export function useTaskSorting(tasks: Task[]) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  const handleSort = (key: string) => {
    let direction = "ascending";

    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig?.key === key &&
      sortConfig.direction === "descending"
    ) {
      key = "";
      direction = "";
    }

    setSortConfig({ key, direction });
  };

  const sortedTasks = useMemo(() => {
    const sortableTasks = [...tasks];
    if (!sortConfig) return sortableTasks;

    if (sortConfig.key === "priority") {
      sortableTasks.sort((a, b) => {
        const valA = a.priority ? 1 : 0;
        const valB = b.priority ? 1 : 0;
        return sortConfig.direction === "ascending" ? valB - valA : valA - valB;
      });
    }

    if (sortConfig.key === "due_date") {
      sortableTasks.sort((a, b) => {
        const dateA = new Date(a.due_date).getTime();
        const dateB = new Date(b.due_date).getTime();
        return sortConfig.direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      });
    }

    return sortableTasks;
  }, [tasks, sortConfig]);

  return { sortedTasks, handleSort, sortConfig };
}
