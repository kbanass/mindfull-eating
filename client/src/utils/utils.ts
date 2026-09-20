export function getMaxKey<T extends string>(
  record: Record<T, number>,
): T | undefined {
  let maxKey: T | undefined;
  let maxCount = -Infinity;

  for (const key of Object.keys(record) as T[]) {
    if (record[key] > maxCount) {
      maxCount = record[key];
      maxKey = key;
    }
  }

  return maxCount === 0 ? undefined : maxKey;
}
