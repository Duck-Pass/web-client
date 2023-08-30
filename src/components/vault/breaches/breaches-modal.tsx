import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BreachesDataTable } from "./breaches-data-table"
import { columns } from "@/components/vault/breaches/breaches-column"

// Delete after API implemention
import mockData from '@/assets/BREACH_DATA.json'
import { useMemo } from "react"

export default function BreachesModal() {
    const data = useMemo(() => mockData, [])

    return (
      <div className="w-full">
        <Dialog>
          <DialogTrigger asChild className="w-full">
            <Button>Check for breaches</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <BreachesDataTable  columns={columns} data={data} />
          </DialogContent>
        </Dialog>
      </div>
    )
}