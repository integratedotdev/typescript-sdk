import {
  authCodePreviewDarkHtml,
  authCodePreviewLightHtml,
} from "@/lib/auth-code-html";
import { cn } from "@/lib/utils";

type AuthCodePreviewProps = {
  className?: string;
};

export function AuthCodePreview({ className }: AuthCodePreviewProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/50 bg-card/60 text-left shadow-xl backdrop-blur-sm",
        className,
      )}
    >
      <div className="text-sm [&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!border-0 [&_pre]:!bg-transparent [&_pre]:!p-4">
        <div
          className="hidden dark:block"
          dangerouslySetInnerHTML={{ __html: authCodePreviewDarkHtml }}
        />
        <div
          className="block dark:hidden"
          dangerouslySetInnerHTML={{ __html: authCodePreviewLightHtml }}
        />
      </div>
    </div>
  );
}
