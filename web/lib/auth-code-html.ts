import { codeToHtml } from "shiki";
import { authQuickstartCodeSample } from "@/lib/marketing-code-samples";

export const [authCodePreviewLightHtml, authCodePreviewDarkHtml] =
  await Promise.all([
    codeToHtml(authQuickstartCodeSample, {
      lang: "ts",
      theme: "github-light-default",
    }),
    codeToHtml(authQuickstartCodeSample, {
      lang: "ts",
      theme: "github-dark-high-contrast",
    }),
  ]);
