export function normalize(value) {
  return value.toLowerCase().trim();
}

export function itemMatchesQuery(entry, query) {
  const needle = normalize(query);
  if (!needle) return true;
  return [
    entry.id,
    entry.title,
    entry.english,
    entry.summary,
    entry.plain,
    entry.group,
    ...entry.aliases,
    ...entry.tags,
    ...entry.useCases,
  ]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

