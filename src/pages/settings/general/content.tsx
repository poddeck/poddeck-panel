import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, UserIcon } from "lucide-react";
import SettingsService from "@/api/services/settings-service.ts";

export default function GeneralPageContent() {
  const [username, setUsername] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchUsername = async () => {
      try {
        setLoading(true);
        const response = await SettingsService.getUsername();
        if (mounted) {
          setUsername(response.username);
          setInitialUsername(response.username);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUsername();

    return () => {
      mounted = false;
    };
  }, []);

  const hasChanges =
    username.trim().length > 0 && username !== initialUsername;

  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      setSaving(true);
      await SettingsService.changeUsername({ username });
      setInitialUsername(username);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <UserIcon className="size-4" />
            <span className="sr-only">User</span>
          </div>
          <Input
            id="username"
            type="text"
            placeholder="Username"
            className="pl-9"
            value={username}
            disabled={loading}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || saving}
        >
          <Save className="mr-2 size-4" />
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
