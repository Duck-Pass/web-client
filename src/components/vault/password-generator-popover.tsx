import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { RotateCw } from "lucide-react"
import PasswordGenerator from "./password-generator"

export default function PasswordGeneratorPopover() {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button">
            <RotateCw />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-30">
          <PasswordGenerator />
        </PopoverContent>
      </Popover>
    )
}