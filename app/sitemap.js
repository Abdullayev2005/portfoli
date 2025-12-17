export default function sitemap() {
  const baseUrl = "https://ozodbek-abdullayev.uz";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
