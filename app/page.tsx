"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";

// 3-level tree: kilas -> subject -> lesson. A student picks kilas1,
// then charts_subject, then xnglo_chart_lesson -- selecting a lesson
// navigates straight to its page. Add more kilas/subjects/lessons here
// as they're built; the selects populate from this data automatically.
const K12_TREE = {
  kilas1: {
    label: "Kilas 1",
    subjects: {
      charts_subject: {
        label: "Charts",
        lessons: {
          xnglo_chart_lesson: {
            label: "xNglo Chart",
            href: "/kilas1/charts/xNglo",
          },
        },
      },
    },
  },
  kilas6: {
    label: "Kilas 6",
    subjects: {
      translet_suzect: {
        label: "Translet",
        lessons: {
          translet_lesson: {
            label: "Translet Lesson",
            href: "/kilas6/translet_suzect/translet_lesson",
          },
        },
      },
    },
  },
  kilasall: {
    label: "Kilas All",
    subjects: {
      subzectwords: {
        label: "Words",
        lessons: {
          lesson_wrdmining: {
            label: "Word Mining",
            href: "/kilasall/subzectwords/lesson_wrdmining",
          },
        },
      },
    },
  },
} as const;

type KilasKey = keyof typeof K12_TREE;

export default function K12Page() {
  const router = useRouter();
  const [kilas, setKilas] = useState<KilasKey | "">("");
  const [subject, setSubject] = useState<string>("");
  const [lesson, setLesson] = useState<string>("");

  const subjects = useMemo(() => {
    if (!kilas) return {};
    return K12_TREE[kilas].subjects;
  }, [kilas]);

  const lessons = useMemo(() => {
    if (!kilas || !subject) return {};
    return (subjects as any)[subject]?.lessons ?? {};
  }, [kilas, subject, subjects]);

  const handleKilasChange = (v: string) => {
    setKilas(v as KilasKey);
    setSubject("");
    setLesson("");
  };

  const handleSubjectChange = (v: string) => {
    setSubject(v);
    setLesson("");
  };

  const handleLessonChange = (v: string) => {
    setLesson(v);
    const href = (lessons as any)[v]?.href;
    if (href) router.push(href);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-950 text-gray-100">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">K12</h1>
          <Link
            href="/kilas6/translet_suzect/translet_lesson"
            className="text-sm bg-gray-900 hover:bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-800 transition"
          >
            Translet →
          </Link>
        </div>

        <div className="flex flex-col gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-300 w-24">Kilas</label>
            <select
              value={kilas}
              onChange={(e) => handleKilasChange(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- select kilas --</option>
              {Object.entries(K12_TREE).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-300 w-24">Subzect</label>
            <select
              value={subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              disabled={!kilas}
              className="flex-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
            >
              <option value="">-- select subzect --</option>
              {Object.entries(subjects).map(([key, val]: [string, any]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-300 w-24">Lesson</label>
            <select
              value={lesson}
              onChange={(e) => handleLessonChange(e.target.value)}
              disabled={!subject}
              className="flex-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
            >
              <option value="">-- select lesson --</option>
              {Object.entries(lessons).map(([key, val]: [string, any]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-gray-500 text-sm">
          Selecting a lesson takes you straight to it.
        </p>
      </div>
    </main>
  );
}
