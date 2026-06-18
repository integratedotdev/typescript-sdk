import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BrandLogo } from "@/components/brand-logo";

export function baseOptions(includeMainLinks: boolean = true): BaseLayoutProps {
  const links: BaseLayoutProps["links"] = [];

  if (includeMainLinks) {
    links.push(
      {
        type: "main",
        url: "/docs",
        text: "Docs",
      },
      {
        type: "main",
        url: "/integrations",
        text: "Integrations",
      },
      {
        type: "main",
        url: "/pricing",
        text: "Pricing",
      },
    );
  }

  links.push(
    {
      type: "button",
      url: "https://integrate.dev/dashboard/login",
      text: "Sign In",
      secondary: true,
    },
    {
      type: "button",
      url: "https://integrate.dev/dashboard/signup",
      text: "Get Started",
      secondary: true,
    },
  );

  return {
    ...(!includeMainLinks
      ? { githubUrl: "https://github.com/integratedotdev/typescript-sdk" }
      : {}),
    links,
    nav: {
      title: <BrandLogo />,
    },
    themeSwitch: {
      enabled: false,
    },
  };
}
