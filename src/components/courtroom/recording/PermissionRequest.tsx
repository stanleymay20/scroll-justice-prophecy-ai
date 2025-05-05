
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileLock } from "lucide-react";

interface PermissionRequestProps {
  mediaType: "audio" | "video" | "transcript";
  onRequestPermission: () => void;
}

export function PermissionRequest({ mediaType, onRequestPermission }: PermissionRequestProps) {
  return (
    <Card className="p-4 bg-muted/20">
      <div className="flex flex-col items-center justify-center">
        <FileLock className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-sm font-medium">Permission Required</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {`Please grant ${mediaType === "audio" ? "microphone" : "camera"} access to record`}
        </p>
        <Button variant="outline" className="mt-4" onClick={onRequestPermission}>
          Request Permission
        </Button>
      </div>
    </Card>
  );
}
