/**
 * Type definitions untuk ResumeIQ
 */

export interface SectionScore {
  score: number;
  feedback: string;
}

export interface KeywordMatch {
  match_percentage: number;
  matched: string[];
  missing_critical: string[];
  missing_nice_to_have: string[];
}

export interface Improvement {
  priority: "high" | "medium" | "low";
  issue: string;
  suggestion: string;
  example?: string;
}

export interface AnalysisResult {
  overall_score: number;
  ats_compatibility: number;
  keyword_match: KeywordMatch;
  section_scores: {
    summary: SectionScore;
    experience: SectionScore;
    skills: SectionScore;
    education: SectionScore;
  };
  top_improvements: Improvement[];
  formatting_issues: string[];
  strengths: string[];
}

export interface AnalysisRecord {
  id: string;
  user_id?: string;
  created_at: string;
  resume_filename: string;
  job_description: string;
  result: AnalysisResult;
  language: "id" | "en";
}

export type ScoreLevel = "excellent" | "good" | "fair" | "poor" | "very_poor";

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 90) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "fair";
  if (score >= 30) return "poor";
  return "very_poor";
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

export function getScoreBgColor(score: number): string {
  if (score >= 70) return "bg-green-100";
  if (score >= 50) return "bg-yellow-100";
  return "bg-red-100";
}
