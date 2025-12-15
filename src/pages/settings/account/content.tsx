import {Button} from "@/components/ui/button.tsx";
import {Trash2} from "lucide-react";

export default function AccountPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <div className="border-b-1 border-secondary pb-2 mb-4 w-full">
          <span className="text-destructive">Delete account</span>
        </div>
        <div className="mb-6">
          <span className="text-muted-foreground text-sm">Are you sure you want to permanently delete your account? This operation cannot be reversed and will result in permanent loss of access to PodDeck.</span>
        </div>
        <div className="flex justify-center">
          <Button variant="destructive"><Trash2/> Delete</Button>
        </div>
      </div>
    </div>
  );
}