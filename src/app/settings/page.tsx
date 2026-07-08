import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Appearance and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AppearanceSection />
        <NotificationsSection />
      </div>
    </div>
  );
}
