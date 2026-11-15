/*
    Tasks page
    Flat checklist of today's tasks. Each task can show its area
    (e.g. "Programming › Algorithms") as a secondary label.
*/

import { useState, type SubmitEvent } from "react";

type Task = {
  id: string;
  title: string;
  area: string[]; // path from broad to specific, e.g. ["Programming", "Algorithms"]
  done: boolean;
};

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Solve one array problem",
    area: ["Programming", "Algorithms"],
    done: false,
  },
  {
    id: "2",
    title: "Read 20 pages",
    area: ["Learning", "Reading"],
    done: false,
  },
  { id: "3", title: "Drink 2L of water", area: [], done: false },
];

// Accepts "Programming › Algorithms", "Programming > Algorithms" or "Programming / Algorithms"
function parseArea(input: string): string[] {
  return input
    .split(/[›>/]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function handleAdd(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: trimmed,
        area: parseArea(area),
        done: false,
      },
    ]);
    setTitle("");
    setArea("");
    setIsAdding(false);
  }

  function cancelAdd() {
    setTitle("");
    setArea("");
    setIsAdding(false);
  }

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <section className="mx-auto w-full max-w-xl p-6 text-left">
      <header className="mb-6 flex items-baseline justify-between">
        {/* Exclamation mark forces the Tailwind classes to be applied */}
        <h1 className="!m-0 !text-3xl">Tasks Today</h1>
        <span className="text-sm">
          {doneCount}/{tasks.length} done
        </span>
      </header>

      <ul className="flex flex-col">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-start gap-2 border-b border-(--border) last:border-b-0"
          >
            <label className="flex flex-1 cursor-pointer items-start gap-3 py-3">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className="mt-1 size-4 shrink-0 accent-(--accent)"
              />
              <div className="flex flex-col">
                <span
                  className={
                    task.done ? "text-(--text) line-through" : "text-(--text-h)"
                  }
                >
                  {task.title}
                </span>
                {task.area.length > 0 && (
                  <span className="text-sm text-(--text)">
                    {task.area.join(" › ")}
                  </span>
                )}
              </div>
            </label>
            {/* Outside the label so clicking it doesn't also toggle the checkbox */}
            <button
              type="button"
              onClick={() => removeTask(task.id)}
              aria-label={`Remove "${task.title}"`}
              title="Remove task"
              className="mt-2 rounded-md p-1.5 text-(--text) hover:bg-red-500/10 hover:text-red-500"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {isAdding ? (
        <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && cancelAdd()}
            placeholder="Task name"
            className="rounded-md border border-(--border) bg-transparent px-3 py-2 text-(--text-h)"
          />
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && cancelAdd()}
            placeholder="Area (optional), e.g. Programming › Algorithms"
            className="rounded-md border border-(--border) bg-transparent px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-(--accent) px-4 py-2 text-sm font-medium text-white"
            >
              Add task
            </button>
            <button
              type="button"
              onClick={cancelAdd}
              className="rounded-md px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="mt-4 rounded-md px-3 py-2 text-sm font-medium text-(--accent) hover:bg-(--accent-bg)"
        >
          + Add task
        </button>
      )}
    </section>
  );
}
