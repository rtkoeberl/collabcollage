export default function formatRelease(releaseArr, page) {
  return releaseArr.map((r, i) => ({
    artist: r.artist,
    key: (i + 1 + (page-1)*100),
    resource_url: r.resource_url,
    role: r.role,
    thumb: r.thumb,
    title: r.title,
    year: r.year,
    id_m: r.type === "master" ? `m${r.id}` : null,
    id_r: r.type === "master" ? `r${r.main_release}` : r.id
  }));
}