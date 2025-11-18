import { ResumeData } from "@/types/resume";

const STORAGE_KEY = "resume-builder-data";

export const saveResumeData = (data: ResumeData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving resume data:", error);
  }
};

export const loadResumeData = (): ResumeData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading resume data:", error);
  }
  return null;
};

export const clearResumeData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing resume data:", error);
  }
};
