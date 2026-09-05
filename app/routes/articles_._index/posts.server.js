export async function getPosts() {
  const modules = import.meta.glob('../articles.*.mdx', {
    eager: true,
  });

  const build = await import('virtual:remix/server-build');

  const posts = await Promise.all(
    Object.entries(modules).map(async ([file, post]) => {
      const id = file.replace('../', 'routes/').replace(/\.mdx$/, '');
      const slug = build.routes[id]?.path;

      if (slug === undefined) {
        throw new Error(`No route for ${id}`);
      }

      const rawModule = await import(
        `../articles.${slug}.mdx?raw`
      );

      const text =
        typeof rawModule === 'string'
          ? rawModule
          : typeof rawModule?.default === 'string'
            ? rawModule.default
            : '';

      const words = text.trim()
        ? text.trim().split(/\s+/).length
        : 0;

      const wordsPerMinute = 225;
      const readingTimeMs =
        (words / wordsPerMinute) * 60 * 1000;

      const hours = readingTimeMs / 1000 / 60 / 60;
      const h = Math.floor(hours);
      const m = Math.floor((hours - h) * 60);
      const s = Math.floor(
        (((hours - h) * 60 - m) * 60)
      );
      const c = Math.floor(
        ((((hours - h) * 60 - m) * 60 - s) * 1000) / 10
      );

      const zeroPrefix = value =>
        value < 10 ? `0${value}` : `${value}`;

      const timecode =
        `${zeroPrefix(h)}:${zeroPrefix(m)}:${zeroPrefix(s)}:${zeroPrefix(c)}`;

      return {
        slug,
        timecode,
        frontmatter: post.frontmatter,
      };
    })
  );

  return sortBy(
    posts,
    post => post.frontmatter.date,
    'desc'
  );
}

function sortBy(arr, key, dir = 'asc') {
  return arr.sort((a, b) => {
    const res = compare(key(a), key(b));
    return dir === 'asc' ? res : -res;
  });
}

function compare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}