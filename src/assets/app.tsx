import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import { CARD_SCAN_THROTTLE_MS } from "./lake/constants.js";
import { LakeRenderer, type CardElementSnapshot } from "./lake/LakeRenderer.js";
import { type Point } from "./lake/logic.js";

interface SearchIndexEntry {
  title: string;
  description: string;
  section: "posts" | "profile" | "projects" | "unknown";
  tags: string[];
  date?: string;
  url: string;
}

interface FinderProps {
  indexUrl: string;
  siteRoot: string;
}

const SECTION_LABELS: Record<"all" | SearchIndexEntry["section"], string> = {
  all: "all",
  posts: "posts",
  profile: "profile",
  projects: "projects",
  unknown: "other",
};

const RECENT_STORAGE_KEY = "portfolio_recent_urls";
const MAX_RESULTS = 8;
const MAX_RECENT_URLS = 5;
const CLOCK_UPDATE_INTERVAL_MS = 30_000;

function Finder({ indexUrl, siteRoot }: FinderProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const [entries, setEntries] = useState<SearchIndexEntry[]>([]);
  const [query, setQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<"all" | SearchIndexEntry["section"]>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentUrls, setRecentUrls] = useState<string[]>(() => readRecentUrls());

  useEffect(() => {
    let active = true;

    async function loadIndex() {
      try {
        setLoading(true);
        const response = await fetch(indexUrl, { headers: { Accept: "application/json" } });
        if (!response.ok) {
          throw new Error(`index fetch failed: ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        const normalized = normalizeEntries(payload, siteRoot);

        if (!active) {
          return;
        }

        setEntries(normalized);
        setError(null);
      } catch {
        if (active) {
          setError("검색 인덱스를 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadIndex();

    return () => {
      active = false;
    };
  }, [indexUrl, siteRoot]);

  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return entries
      .filter((entry) => (sectionFilter === "all" ? true : entry.section === sectionFilter))
      .map((entry) => ({ entry, score: scoreEntry(entry, normalizedQuery) }))
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score)
      .map((item) => item.entry)
      .slice(0, MAX_RESULTS);
  }, [entries, query, sectionFilter]);

  const recentEntries = useMemo(() => {
    return recentUrls
      .map((url) => entries.find((entry) => entry.url === url))
      .filter((entry): entry is SearchIndexEntry => Boolean(entry));
  }, [entries, recentUrls]);

  useEffect(() => {
    if (visibleEntries.length === 0) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex((current) => Math.max(0, Math.min(current, visibleEntries.length - 1)));
  }, [visibleEntries]);

  useEffect(() => {
    const handleHotkey = (event: KeyboardEvent) => {
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isEditable(event.target)) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === "Escape" && document.activeElement === inputRef.current) {
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleHotkey);
    return () => {
      document.removeEventListener("keydown", handleHotkey);
    };
  }, []);

  const showRecent = query.trim().length === 0 && recentEntries.length > 0;
  const activeDescendantId = visibleEntries.length > 0 ? `finder-option-${activeIndex}` : undefined;

  const handleOpenUrl = (url: string): void => {
    const nextUrls = upsertRecentUrl(recentUrls, url);
    setRecentUrls(nextUrls);
    writeRecentUrls(nextUrls);
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => {
        if (visibleEntries.length === 0) {
          return 0;
        }

        return (current + 1) % visibleEntries.length;
      });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => {
        if (visibleEntries.length === 0) {
          return 0;
        }

        return (current - 1 + visibleEntries.length) % visibleEntries.length;
      });
      return;
    }

    if (event.key === "Enter") {
      const chosen = visibleEntries[activeIndex];
      if (chosen) {
        handleOpenUrl(chosen.url);
        window.location.assign(chosen.url);
      }
    }
  };

  return (
    <section className="finder-panel" aria-label="빠른 탐색기">
      <div className="finder-panel__header">
        <div>
          <p className="finder-panel__eyebrow">Lake Finder</p>
          <h2 className="finder-panel__title">호수 위에서 글 찾기</h2>
        </div>
        <p className="finder-panel__meta">{entries.length} indexed</p>
      </div>

      <div className="finder-panel__controls">
        <label className="finder-panel__field" htmlFor="finder-query">
          <span className="finder-panel__label">Search</span>
          <input
            id="finder-query"
            ref={inputRef}
            className="finder-panel__input"
            type="search"
            role="combobox"
            aria-label="검색어"
            aria-expanded={!loading && !error}
            aria-controls="finder-result-list"
            aria-activedescendant={activeDescendantId}
            aria-autocomplete="list"
            placeholder="제목, 요약, 태그를 검색해보세요"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
          />
        </label>

        <label className="finder-panel__field finder-panel__field--select">
          <span className="finder-panel__label">Scope</span>
          <select
            className="finder-panel__select"
            aria-label="섹션 필터"
            value={sectionFilter}
            onChange={(event) => setSectionFilter(event.target.value as "all" | SearchIndexEntry["section"])}
          >
            <option value="all">all</option>
            <option value="posts">posts</option>
            <option value="projects">projects</option>
            <option value="profile">profile</option>
          </select>
        </label>
      </div>

      <p className="finder-panel__hint">`/` 포커스, `↑↓` 이동, `Enter` 열기</p>

      {showRecent ? (
        <div className="finder-panel__recent" aria-label="최근 방문">
          {recentEntries.map((entry) => (
            <button
              key={`recent-${entry.url}`}
              type="button"
              onClick={() => {
                handleOpenUrl(entry.url);
                window.location.assign(entry.url);
              }}
            >
              {entry.title}
            </button>
          ))}
          <button
            className="finder-panel__clear"
            type="button"
            onClick={() => {
              setRecentUrls([]);
              writeRecentUrls([]);
            }}
          >
            history clear
          </button>
        </div>
      ) : null}

      {loading ? <p className="finder-panel__status">indexing...</p> : null}
      {error ? <p className="finder-panel__status finder-panel__status--error">{error}</p> : null}

      {!loading && !error ? (
        <ul id="finder-result-list" className="finder-panel__list" role="listbox" aria-label="검색 결과">
          {visibleEntries.map((entry, index) => {
            const isActive = index === activeIndex;
            const optionId = `finder-option-${index}`;

            return (
              <li
                id={optionId}
                key={`${entry.section}-${entry.url}`}
                className={`finder-panel__item ${isActive ? "is-active" : ""}`}
                role="option"
                aria-selected={isActive}
              >
                <a
                  href={entry.url}
                  className="finder-panel__link"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => handleOpenUrl(entry.url)}
                >
                  <span className="finder-panel__badge">{SECTION_LABELS[entry.section]}</span>
                  <strong>{renderHighlighted(entry.title, query)}</strong>
                  <span>{renderHighlighted(entry.description || "요약 정보가 없습니다.", query)}</span>
                </a>
              </li>
            );
          })}

          {visibleEntries.length === 0 ? <li className="finder-panel__status">no match</li> : null}
        </ul>
      ) : null}
    </section>
  );
}

function bootstrapApp(): void {
  document.documentElement.classList.add("js");
  setupLocalClock();
  setupLakeStage();
  bootstrapReactFinder();
}

function setupLakeStage(): void {
  const canvas = document.getElementById("lake-canvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const body = document.body;
  const siteRoot = ensureTrailingSlash(body.dataset.siteRoot ?? "/");
  const pageKind = body.dataset.kind ?? "page";
  const reducedMotion = prefersReducedMotion();
  const renderer = new LakeRenderer({
    canvas,
    siteRoot,
    pageKind,
    reducedMotion,
  });

  const readCards = (): CardElementSnapshot[] => {
    return Array.from(document.querySelectorAll<HTMLElement>(".post-card")).map((element, index) => {
      const rect = element.getBoundingClientRect();
      return {
        element,
        id: element.dataset.cardId ?? `${element.dataset.cardKind ?? "card"}-${index}`,
        center: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        },
      };
    });
  };

  let refreshTimeout = 0;
  const refreshCards = (): void => {
    renderer.setCards(readCards());
    renderer.refresh();
  };

  const scheduleRefresh = (): void => {
    if (refreshTimeout !== 0) {
      window.clearTimeout(refreshTimeout);
    }

    refreshTimeout = window.setTimeout(() => {
      refreshCards();
      refreshTimeout = 0;
    }, CARD_SCAN_THROTTLE_MS);
  };

  const handlePointer = (point: Point | null): void => {
    renderer.setPointer(point);
  };

  renderer.start();
  refreshCards();

  if (!reducedMotion) {
    window.addEventListener(
      "pointermove",
      (event) => {
        handlePointer({ x: event.clientX, y: event.clientY });
      },
      { passive: true },
    );
    window.addEventListener(
      "pointerout",
      (event) => {
        if (event.relatedTarget === null) {
          handlePointer(null);
        }
      },
      { passive: true },
    );
    window.addEventListener(
      "touchmove",
      (event) => {
        const touch = event.touches[0];
        if (!touch) {
          return;
        }

        handlePointer({ x: touch.clientX, y: touch.clientY });
      },
      { passive: true },
    );
    window.addEventListener("touchend", () => handlePointer(null), { passive: true });
  }
  window.addEventListener(
    "resize",
    () => {
      renderer.resize();
      scheduleRefresh();
    },
    { passive: true },
  );
  window.addEventListener("scroll", scheduleRefresh, { passive: true });
  window.addEventListener("beforeunload", () => renderer.destroy(), { once: true });
}

function bootstrapReactFinder(): void {
  const rootElement = document.getElementById("portfolio-react-root");
  if (!rootElement) {
    return;
  }

  const indexUrl = rootElement.dataset.indexUrl ?? "assets/search-index.json";
  const siteRoot = rootElement.dataset.siteRoot ?? "/";
  const root = createRoot(rootElement);
  root.render(<Finder indexUrl={indexUrl} siteRoot={siteRoot} />);
}

function setupLocalClock(): void {
  const target = document.getElementById("local-clock");
  if (!target) {
    return;
  }

  const timezone = target.dataset.timezone ?? readBrowserTimeZone() ?? "Asia/Seoul";
  const label = target.dataset.label ?? formatTimezoneLabel(timezone);

  const update = (): void => {
    target.textContent = `${label} ${readClockTime(timezone)}`;
  };

  update();
  window.setInterval(update, CLOCK_UPDATE_INTERVAL_MS);
}

function normalizeEntries(payload: unknown, siteRoot: string): SearchIndexEntry[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((candidate) => normalizeEntry(candidate, siteRoot))
    .filter((candidate): candidate is SearchIndexEntry => Boolean(candidate));
}

function normalizeEntry(candidate: unknown, siteRoot: string): SearchIndexEntry | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const raw = candidate as Record<string, unknown>;
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const description = typeof raw.description === "string" ? raw.description.trim() : "";
  const rawUrl = typeof raw.url === "string" ? raw.url.trim() : "";
  const url = resolveNavigableUrl(rawUrl, siteRoot);
  const section = normalizeSection(raw.section);

  if (!title || !url) {
    return null;
  }

  const tags = Array.isArray(raw.tags)
    ? raw.tags.map((tag) => (typeof tag === "string" ? tag.trim() : "")).filter((tag): tag is string => Boolean(tag))
    : [];

  const date = typeof raw.date === "string" ? raw.date : undefined;

  return {
    title,
    description,
    section,
    tags,
    date,
    url,
  };
}

function normalizeSection(value: unknown): SearchIndexEntry["section"] {
  if (value === "posts" || value === "profile" || value === "projects") {
    return value;
  }

  return "unknown";
}

function ensureTrailingSlash(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }

  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

function resolveNavigableUrl(rawUrl: string, siteRoot: string): string {
  if (!rawUrl) {
    return "";
  }

  if (/^[a-z]+:/i.test(rawUrl)) {
    return rawUrl;
  }

  if (!rawUrl.startsWith("/")) {
    return rawUrl;
  }

  const normalizedRoot = ensureTrailingSlash(siteRoot);
  if (normalizedRoot === "/") {
    return rawUrl;
  }

  const normalizedPath = rawUrl.replace(/^\//, "");
  return `${normalizedRoot}${normalizedPath}`;
}

function scoreEntry(entry: SearchIndexEntry, query: string): number {
  if (!query) {
    return 1;
  }

  let score = 0;
  const normalizedTitle = entry.title.toLowerCase();
  const normalizedDescription = entry.description.toLowerCase();
  const normalizedTags = entry.tags.join(" ").toLowerCase();

  if (normalizedTitle.includes(query)) {
    score += 5;
  }

  if (normalizedDescription.includes(query)) {
    score += 2;
  }

  if (normalizedTags.includes(query)) {
    score += 3;
  }

  return score;
}

function renderHighlighted(text: string, query: string): JSX.Element | string {
  const normalized = query.trim();
  if (!normalized) {
    return text;
  }

  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(${escaped})`, "ig");
  const parts = text.split(pattern);

  if (parts.length <= 1) {
    return text;
  }

  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return <mark key={`${part}-${index}`}>{part}</mark>;
        }

        return <span key={`${part}-${index}`}>{part}</span>;
      })}
    </>
  );
}

function readRecentUrls(): string[] {
  try {
    const payload = window.localStorage.getItem(RECENT_STORAGE_KEY);
    if (!payload) {
      return [];
    }

    const parsed = JSON.parse(payload) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeRecentUrls(urls: string[]): void {
  try {
    window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(urls));
  } catch {
    // storage is optional.
  }
}

function upsertRecentUrl(existing: string[], url: string): string[] {
  const deduplicated = [url, ...existing.filter((candidate) => candidate !== url)];
  return deduplicated.slice(0, MAX_RECENT_URLS);
}

function isEditable(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readBrowserTimeZone(): string | null {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezone && timezone.trim().length > 0 ? timezone : null;
  } catch {
    return null;
  }
}

function formatTimezoneLabel(timezone: string): string {
  const segments = timezone.split("/");
  return (segments[segments.length - 1] ?? "Local").replaceAll("_", " ");
}

function readClockTime(timeZone: string): string {
  const now = new Date();

  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    });
    return formatter.format(now);
  } catch {
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapApp, { once: true });
} else {
  bootstrapApp();
}
