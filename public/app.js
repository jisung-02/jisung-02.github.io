import { matchesSearch } from "./search.mjs";
const themeButton = document.querySelector(".theme-toggle");
themeButton?.addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeButton.setAttribute("aria-pressed", String(dark));
  try {
    localStorage.setItem("margin-theme", dark ? "dark" : "light");
  } catch {}
});
if (themeButton)
  themeButton.setAttribute(
    "aria-pressed",
    String(document.documentElement.dataset.theme === "dark"),
  );
const input = document.querySelector("#search"),
  entries = [...document.querySelectorAll(".entry")];
let category = "전체",
  tag = "";
function filter() {
  const query = (input?.value || "").toLocaleLowerCase();
  let count = 0;
  for (const entry of entries) {
    const show =
      (category === "전체" || entry.dataset.category === category) &&
      (!tag || JSON.parse(entry.dataset.tags).includes(tag)) &&
      matchesSearch(entry.dataset.search, query);
    entry.hidden = !show;
    if (show) count++;
  }
  const status = document.querySelector("#results");
  if (status) status.textContent = `${count}개의 기록`;
  const empty = document.querySelector("#empty");
  if (empty) empty.hidden = count !== 0;
}
document.querySelectorAll(".filter").forEach((button) =>
  button.addEventListener("click", () => {
    category = button.dataset.category;
    tag = "";
    document
      .querySelectorAll(".filter")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    filter();
  }),
);
document.querySelectorAll("[data-tag]").forEach((button) =>
  button.addEventListener("click", () => {
    category = "전체";
    tag = button.dataset.tag;
    document
      .querySelectorAll(".filter")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.category === "전체")),
      );
    if (input) input.value = "";
    filter();
    document.querySelector("#records")?.scrollIntoView();
  }),
);
input?.addEventListener("input", () => {
  tag = "";
  filter();
});

const navInput = document.querySelector(".nav-search input");
const initialQuery = new URLSearchParams(location.search).get("q") || "";
if (navInput) navInput.value = initialQuery;
if (input) {
  input.value = initialQuery;
  filter();
}
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (menu) menu.open = true;
    navInput?.focus();
    navInput?.select();
  }
});

const menu = document.querySelector(".site-menu");
const compactScreen = matchMedia("(max-width: 680px)");
function syncMenu() {
  if (menu) menu.open = !compactScreen.matches;
}
syncMenu();
compactScreen.addEventListener("change", syncMenu);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && compactScreen.matches && menu?.open) {
    menu.open = false;
    menu.querySelector("summary")?.focus();
  }
});
document.addEventListener("click", (event) => {
  if (compactScreen.matches && menu?.open && !menu.contains(event.target))
    menu.open = false;
});
