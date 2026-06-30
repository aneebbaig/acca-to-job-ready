import type { Branch, Curriculum, Module, Topic, Track } from "./types";
import { foundation } from "./foundation";
import { tracks } from "./tracks";

export const curriculum: Curriculum = { foundation, tracks };

export * from "./types";

// --- Lookups (pure, no DB) --------------------------------------------------

export function getTrack(trackId: string): Track | undefined {
  return tracks.find((t) => t.id === trackId);
}

export function getBranch(trackId: string, branchId: string): Branch | undefined {
  return getTrack(trackId)?.branches.find((b) => b.id === branchId);
}

// Every topic across foundation + all tracks/branches — used to resolve a slug.
function allModules(): Module[] {
  return [
    ...foundation,
    ...tracks.flatMap((t) => t.branches.flatMap((b) => b.modules)),
  ];
}

let topicIndex: Map<string, Topic> | null = null;
function index(): Map<string, Topic> {
  if (!topicIndex) {
    topicIndex = new Map();
    for (const m of allModules()) {
      for (const topic of m.topics) topicIndex.set(topic.slug, topic);
    }
  }
  return topicIndex;
}

export function getTopic(slug: string): Topic | undefined {
  return index().get(slug);
}

export function getAllTopicSlugs(): string[] {
  return [...index().keys()];
}

// The ordered set of modules a learner sees: shared foundation first, then the
// modules of their chosen branch (§13).
export function getRoadmapModules(
  trackId: string | null,
  branchId: string | null,
): { foundation: Module[]; branchModules: Module[] } {
  const branch =
    trackId && branchId ? getBranch(trackId, branchId) : undefined;
  return { foundation, branchModules: branch?.modules ?? [] };
}

// Find which module/branch/track a topic belongs to (for breadcrumbs / next).
export function locateTopic(slug: string):
  | {
      topic: Topic;
      module: Module;
      track?: Track;
      branch?: Branch;
      area: "foundation" | "branch";
    }
  | undefined {
  for (const m of foundation) {
    const topic = m.topics.find((t) => t.slug === slug);
    if (topic) return { topic, module: m, area: "foundation" };
  }
  for (const track of tracks) {
    for (const branch of track.branches) {
      for (const m of branch.modules) {
        const topic = m.topics.find((t) => t.slug === slug);
        if (topic) return { topic, module: m, track, branch, area: "branch" };
      }
    }
  }
  return undefined;
}
