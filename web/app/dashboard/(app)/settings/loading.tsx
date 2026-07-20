import { SettingsSkeleton } from "@/components/settings-skeleton";

export default function SettingsLoading() {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50" />
      <SettingsSkeleton />
    </>
  );
}
