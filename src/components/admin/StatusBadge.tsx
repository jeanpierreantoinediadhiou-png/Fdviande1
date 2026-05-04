import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    EN_ATTENTE: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50 shadow-none",
    CONFIRMEE: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 shadow-none",
    ANNULEE: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 shadow-none",
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium", styles[status] || "bg-gray-50 text-gray-700")}
    >
      {status.replace("_", " ")}
    </Badge>
  );
};
