import {Button} from "@/components/ui/button.tsx";
import {ShieldPlus} from "lucide-react";

export default function SecurityPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <div className="border-b-1 border-secondary pb-2 mb-4 w-full">
          <span>Two-factor authentication</span>
        </div>
        <div className="mb-6">
          <span className="text-muted-foreground text-sm">With two-factor authentication, you can protect your account against unauthorized access.</span>
        </div>
        <div className="flex justify-center">
          <Button variant="default"><ShieldPlus/> Activate</Button>
        </div>
      </div>
    </div>
  );
}