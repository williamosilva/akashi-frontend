/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["default", "en", "pt"],
    defaultLocale: "default",
    localeDetection: false,
  },
};

module.exports = nextConfig;
