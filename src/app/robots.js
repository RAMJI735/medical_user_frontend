export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },

    sitemap: "https://medical-user-frontend.vercel.app/sitemap.xml",
  };
}
