import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Save, UserIcon} from "lucide-react";

export default function GeneralPageContent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="name">Username</Label>
        <div className='relative'>
          <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
            <UserIcon className='size-4' />
            <span className='sr-only'>User</span>
          </div>
          <Input type='text' placeholder='Username' className='peer pl-9' />
        </div>
      </div>
      <div>
        <Button variant="default"><Save/> Save</Button>
      </div>
    </div>
  );
}