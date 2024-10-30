export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "LinkBin",
  description:
    "Effortlessly create shortened URLs and share text content with ease.",
  navItems: [
    {
      label: "Shorten",
      href: "/s",
    },
    {
      label: "Informations",
      href: "/i",
    },
  ],
  links: {
    github: "https://github.com/AlexArtaud-Dev/LinkBin",
  },
};
