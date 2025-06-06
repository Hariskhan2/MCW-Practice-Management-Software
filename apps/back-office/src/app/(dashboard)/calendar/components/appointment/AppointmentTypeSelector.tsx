import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@mcw/ui";
import { Button } from "@mcw/ui";

interface AppointmentTypeSelectorProps {
  disabled?: boolean;
}

export const AppointmentTypeSelector: React.FC<
  AppointmentTypeSelectorProps
> = ({ disabled = false }) => {
  return (
    <div className="flex gap-4">
      <Button
        className="flex-1 justify-start gap-2"
        disabled={disabled}
        variant="outline"
      >
        <div className="flex -space-x-2">
          <Avatar className="h-6 w-6 border-2 border-background">
            <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MCW_Design_File-mxU5Flus7fWjN7ZKABOCy9HgIHTYRP.png" />
            <AvatarFallback>A1</AvatarFallback>
          </Avatar>
          <Avatar className="h-6 w-6 border-2 border-background">
            <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MCW_Design_File-mxU5Flus7fWjN7ZKABOCy9HgIHTYRP.png" />
            <AvatarFallback>A2</AvatarFallback>
          </Avatar>
        </div>
        Individual or couple
      </Button>
      <Button
        className="flex-1 justify-start gap-2"
        disabled={disabled}
        variant="outline"
      >
        <div className="flex -space-x-2">
          <Avatar className="h-6 w-6 border-2 border-background">
            <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MCW_Design_File-mxU5Flus7fWjN7ZKABOCy9HgIHTYRP.png" />
            <AvatarFallback>G1</AvatarFallback>
          </Avatar>
          <Avatar className="h-6 w-6 border-2 border-background">
            <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MCW_Design_File-mxU5Flus7fWjN7ZKABOCy9HgIHTYRP.png" />
            <AvatarFallback>G2</AvatarFallback>
          </Avatar>
          <Avatar className="h-6 w-6 border-2 border-background">
            <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MCW_Design_File-mxU5Flus7fWjN7ZKABOCy9HgIHTYRP.png" />
            <AvatarFallback>G3</AvatarFallback>
          </Avatar>
        </div>
        Group
      </Button>
    </div>
  );
};
