import { Loader2Icon, LoaderPinwheelIcon } from "lucide-react"

import { cn } from "@/shared/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderPinwheelIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
