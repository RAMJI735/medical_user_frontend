export default function sitemap() {
  return [
    {
      url: "https://medical-user-frontend.vercel.app/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://medical-user-frontend.vercel.app/dashboard/medicine",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
