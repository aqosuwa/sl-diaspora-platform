let counter = 0;

export function makeId(prefix = "id") {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter}${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

export function makeCaseRef(prefix) {
  const year = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${n}`;
}
