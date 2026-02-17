import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

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
const NOW_ROTATE_INTERVAL_MS = 2800;
const FLOW_DRIFT_MAX_OFFSET = 12;
const PAGE_ENTER_DURATION_MS = 380;
const PAGE_LEAVE_DURATION_MS = 210;
const CLOCK_UPDATE_INTERVAL_MS = 30_000;
const CLOCK_BLOOM_OPEN_MINUTES = 6 * 60;
const CLOCK_BLOOM_PEAK_MINUTES = 12 * 60;
const CLOCK_BLOOM_CLOSE_MINUTES = 22 * 60;
const CLOCK_BLOOM_MIN = 0.14;

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

        if (active) {
          setEntries(normalized);
          setError(null);
        }
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

    setActiveIndex((current) => {
      if (current < 0) {
        return 0;
      }

      return Math.min(current, visibleEntries.length - 1);
    });
  }, [visibleEntries]);

  useEffect(() => {
    const handleGlobalHotkey = (event: KeyboardEvent) => {
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isEditable(event.target)) {
        event.preventDefault();
        inputRef.current?.focus();
        return;
      }

      if (event.key === "Escape" && document.activeElement === inputRef.current) {
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleGlobalHotkey);
    return () => {
      document.removeEventListener("keydown", handleGlobalHotkey);
    };
  }, []);

  const showRecent = query.trim().length === 0 && recentEntries.length > 0;
  const activeDescendantId = visibleEntries.length > 0 ? `finder-option-${activeIndex}` : undefined;

  const handleOpenUrl = (url: string): void => {
    const nextUrls = upsertRecentUrl(recentUrls, url);
    setRecentUrls(nextUrls);
    writeRecentUrls(nextUrls);
  };

  const handleClearRecents = (): void => {
    setRecentUrls([]);
    writeRecentUrls([]);
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
    <section className="finder" aria-label="빠른 탐색기">
      <div className="finder__head">
        <h2 className="finder__title">Navigator</h2>
        <span className="finder__count">{entries.length} entries</span>
      </div>
      <p className="finder__subtitle">"/"로 즉시 검색 · 화살표 키로 이동 · Enter로 열기</p>

      <div className="finder__controls">
        <input
          id="finder-query"
          ref={inputRef}
          className="finder__input"
          type="search"
          role="combobox"
          aria-label="검색어"
          aria-expanded={!loading && !error}
          aria-controls="finder-result-list"
          aria-activedescendant={activeDescendantId}
          aria-autocomplete="list"
          placeholder="글, 프로젝트, 태그 검색"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <select
          className="finder__select"
          aria-label="섹션 필터"
          value={sectionFilter}
          onChange={(event) => setSectionFilter(event.target.value as "all" | SearchIndexEntry["section"])}
        >
          <option value="all">all</option>
          <option value="posts">posts</option>
          <option value="projects">projects</option>
          <option value="profile">profile</option>
        </select>
      </div>

      {showRecent ? (
        <div className="finder__recent" aria-label="최근 방문">
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
          <button className="finder__clear" type="button" onClick={handleClearRecents}>
            최근 기록 지우기
          </button>
        </div>
      ) : null}

      {loading ? <p className="finder__status">인덱스 로딩 중...</p> : null}
      {error ? <p className="finder__status finder__status--error">{error}</p> : null}

      {!loading && !error ? (
        <ul id="finder-result-list" className="finder__list" role="listbox" aria-label="검색 결과">
          {visibleEntries.map((entry, index) => {
            const isActive = index === activeIndex;
            const optionId = `finder-option-${index}`;

            return (
              <li
                id={optionId}
                key={`${entry.section}-${entry.url}`}
                className={`finder__item ${isActive ? "is-active" : ""}`}
                role="option"
                aria-selected={isActive}
              >
                <a
                  href={entry.url}
                  className="finder__link"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => handleOpenUrl(entry.url)}
                >
                  <span className="finder__badge">{SECTION_LABELS[entry.section]}</span>
                  <strong>{renderHighlighted(entry.title, query)}</strong>
                  <span>{renderHighlighted(entry.description || "요약 정보가 없습니다.", query)}</span>
                </a>
              </li>
            );
          })}

          {visibleEntries.length === 0 ? <li className="finder__status">검색 결과가 없습니다.</li> : null}
        </ul>
      ) : null}
    </section>
  );
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

function normalizeSiteRoot(siteRoot: string): string {
  const trimmed = siteRoot.trim();
  if (!trimmed || trimmed === "/") {
    return "";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash.slice(0, -1) : withLeadingSlash;
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

  const normalizedRoot = normalizeSiteRoot(siteRoot);
  if (!normalizedRoot) {
    return rawUrl;
  }

  if (rawUrl === "/" || rawUrl === normalizedRoot) {
    return `${normalizedRoot}/`;
  }

  if (rawUrl.startsWith(`${normalizedRoot}/`)) {
    return rawUrl;
  }

  return `${normalizedRoot}${rawUrl}`;
}

function scoreEntry(entry: SearchIndexEntry, query: string): number {
  if (!query) {
    return 1;
  }

  const title = entry.title.toLowerCase();
  const description = entry.description.toLowerCase();
  const tags = entry.tags.join(" ").toLowerCase();

  let score = 0;

  if (title.includes(query)) {
    score += 5;
  }

  if (description.includes(query)) {
    score += 2;
  }

  if (tags.includes(query)) {
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
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeRecentUrls(urls: string[]): void {
  try {
    window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(urls));
  } catch {
    // storage is optional for this widget.
  }
}

function upsertRecentUrl(existing: string[], url: string): string[] {
  const deduplicated = [url, ...existing.filter((candidate) => candidate !== url)];
  return deduplicated.slice(0, MAX_RECENT_URLS);
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;
  return tagName === "INPUT" || tagName === "TEXTAREA" || target.isContentEditable;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function supportsNativeViewTransition(): boolean {
  return "startViewTransition" in document;
}

function isModifiedMouseEvent(event: MouseEvent): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function isSameDocumentHashNavigation(destination: URL): boolean {
  if (!destination.hash) {
    return false;
  }

  return (
    destination.pathname === window.location.pathname &&
    destination.search === window.location.search
  );
}

function isInternalNavigableLink(link: HTMLAnchorElement): boolean {
  if (link.target && link.target !== "_self") {
    return false;
  }

  if (link.hasAttribute("download")) {
    return false;
  }

  const destination = new URL(link.href, window.location.href);
  if (destination.origin !== window.location.origin) {
    return false;
  }

  return !isSameDocumentHashNavigation(destination);
}

function setupPageEnterTransition(): void {
  if (prefersReducedMotion()) {
    return;
  }

  const root = document.documentElement;
  root.classList.add("is-page-enter");

  window.requestAnimationFrame(() => {
    root.classList.add("is-page-enter-ready");
  });

  window.setTimeout(() => {
    root.classList.remove("is-page-enter");
    root.classList.remove("is-page-enter-ready");
  }, PAGE_ENTER_DURATION_MS);
}

function setupPageLeaveTransition(): void {
  if (prefersReducedMotion() || supportsNativeViewTransition()) {
    return;
  }

  let isLeaving = false;

  document.addEventListener(
    "click",
    (event) => {
      if (isLeaving || event.defaultPrevented) {
        return;
      }

      if (event.button !== 0 || isModifiedMouseEvent(event)) {
        return;
      }

      if (!(event.target instanceof Element)) {
        return;
      }

      const link = event.target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || !isInternalNavigableLink(link)) {
        return;
      }

      event.preventDefault();
      isLeaving = true;

      document.documentElement.classList.add("is-page-leave");
      window.setTimeout(() => {
        window.location.assign(link.href);
      }, PAGE_LEAVE_DURATION_MS);
    },
    { capture: true },
  );
}

function setupPageTransitions(): void {
  if (supportsNativeViewTransition()) {
    return;
  }

  setupPageEnterTransition();
  setupPageLeaveTransition();
}

function revealAllTargets(): void {
  document.querySelectorAll<HTMLElement>(".reveal").forEach((target) => {
    target.classList.add("is-visible");
  });
}

function setupScrollProgress(): void {
  const root = document.documentElement;

  const updateProgress = (): void => {
    const maxScrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScrollable <= 0) {
      root.style.setProperty("--scroll-progress", "0%");
      return;
    }

    const progress = Math.min(100, Math.max(0, (window.scrollY / maxScrollable) * 100));
    root.style.setProperty("--scroll-progress", `${progress}%`);
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

function setupRevealObserver(): void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
  if (targets.length === 0) {
    return;
  }

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    revealAllTargets();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -6% 0px",
    },
  );

  targets.forEach((target) => observer.observe(target));
}

function setupNowRotator(): void {
  if (prefersReducedMotion()) {
    return;
  }

  const target = document.getElementById("now-rotator");
  if (!target) {
    return;
  }

  const phrases =
    target.dataset.nowPhrases
      ?.split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0) ?? [];

  if (phrases.length < 2) {
    return;
  }

  let index = 0;

  window.setInterval(() => {
    index = (index + 1) % phrases.length;
    target.classList.add("is-swapping");

    window.setTimeout(() => {
      target.textContent = phrases[index] ?? phrases[0] ?? "building";
      target.classList.remove("is-swapping");
    }, 160);
  }, NOW_ROTATE_INTERVAL_MS);
}

function setupLocalClock(): void {
  const target = document.getElementById("local-clock");
  if (!target) {
    return;
  }

  const browserTimeZone = readBrowserTimeZone();
  const timezone = target.dataset.timezone ?? browserTimeZone ?? "Asia/Seoul";
  const label = target.dataset.label ?? formatTimezoneLabel(timezone);
  const bloom = createClockBloom();
  const text = document.createElement("span");
  text.className = "site-header__clock-text";
  target.replaceChildren(bloom, text);

  const updateClockAndBloom = (): void => {
    const reading = readClockTime(timezone);
    text.textContent = `${label} ${reading.text}`;
    const bloomLevel = getClockBloomLevel(reading.hour, reading.minute);
    target.style.setProperty("--clock-bloom", bloomLevel.toFixed(3));
  };

  updateClockAndBloom();
  window.setInterval(updateClockAndBloom, CLOCK_UPDATE_INTERVAL_MS);
}

function readBrowserTimeZone(): string | null {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone && timezone.trim().length > 0) {
      return timezone;
    }
  } catch {
    return null;
  }

  return null;
}

function formatTimezoneLabel(timezone: string): string {
  const segments = timezone.split("/");
  const city = segments[segments.length - 1] ?? "";
  const normalized = city.replaceAll("_", " ").trim();
  return normalized.length > 0 ? normalized : "Local";
}

function createClockBloom(): HTMLSpanElement {
  const bloom = document.createElement("span");
  bloom.className = "site-header__clock-bloom";
  bloom.setAttribute("aria-hidden", "true");

  for (let index = 1; index <= 3; index += 1) {
    const petal = document.createElement("span");
    petal.className = `site-header__clock-petal site-header__clock-petal--${index}`;
    bloom.append(petal);
  }

  const core = document.createElement("span");
  core.className = "site-header__clock-core";
  bloom.append(core);
  return bloom;
}

function readClockTime(timeZone: string): { text: string; hour: number; minute: number } {
  const now = new Date();

  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    });
    const parts = formatter.formatToParts(now);
    const hourPart = Number(parts.find((part) => part.type === "hour")?.value ?? now.getHours());
    const minutePart = Number(parts.find((part) => part.type === "minute")?.value ?? now.getMinutes());
    const hour = Number.isFinite(hourPart) ? hourPart : now.getHours();
    const minute = Number.isFinite(minutePart) ? minutePart : now.getMinutes();
    return {
      text: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      hour,
      minute,
    };
  } catch {
    const hour = now.getHours();
    const minute = now.getMinutes();
    return {
      text: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      hour,
      minute,
    };
  }
}

function getClockBloomLevel(hour: number, minute: number): number {
  const minutes = hour * 60 + minute;

  if (minutes <= CLOCK_BLOOM_OPEN_MINUTES || minutes >= CLOCK_BLOOM_CLOSE_MINUTES) {
    return CLOCK_BLOOM_MIN;
  }

  if (minutes <= CLOCK_BLOOM_PEAK_MINUTES) {
    const progress =
      (minutes - CLOCK_BLOOM_OPEN_MINUTES) /
      (CLOCK_BLOOM_PEAK_MINUTES - CLOCK_BLOOM_OPEN_MINUTES);
    return CLOCK_BLOOM_MIN + progress * (1 - CLOCK_BLOOM_MIN);
  }

  const fade =
    (minutes - CLOCK_BLOOM_PEAK_MINUTES) /
    (CLOCK_BLOOM_CLOSE_MINUTES - CLOCK_BLOOM_PEAK_MINUTES);
  return CLOCK_BLOOM_MIN + (1 - fade) * (1 - CLOCK_BLOOM_MIN);
}

function setupFlowDrift(): void {
  if (prefersReducedMotion()) {
    return;
  }

  const items = Array.from(document.querySelectorAll<HTMLElement>("[data-drift]"));
  if (items.length === 0) {
    return;
  }

  let ticking = false;

  const update = (): void => {
    const viewportCenter = window.innerHeight * 0.5;

    items.forEach((item) => {
      const speed = Number(item.dataset.driftSpeed ?? "0");
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height * 0.5;
      const distance = itemCenter - viewportCenter;
      const offset = Math.max(
        -FLOW_DRIFT_MAX_OFFSET,
        Math.min(FLOW_DRIFT_MAX_OFFSET, distance * speed),
      );
      item.style.transform = `translateY(${offset.toFixed(2)}px)`;
    });

    ticking = false;
  };

  const requestUpdate = (): void => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  requestUpdate();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
}

function setupMotionAndReveal(): void {
  setupScrollProgress();
  setupRevealObserver();
  setupNowRotator();
  setupFlowDrift();
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

function bootstrapApp(): void {
  document.documentElement.classList.add("js");
  setupPageTransitions();
  setupLocalClock();
  setupMotionAndReveal();
  bootstrapReactFinder();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapApp, { once: true });
} else {
  bootstrapApp();
}
