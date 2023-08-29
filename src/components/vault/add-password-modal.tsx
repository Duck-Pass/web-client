import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AddPasswordForm } from "./add-password-form"

export default function AddPasswordModal() {
    return (
      <div className="w-full">
        <Dialog>
          <DialogTrigger asChild className="w-full">
            <Button>Add password</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a new password</DialogTitle>
              <DialogDescription>
                Type a new password here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <AddPasswordForm />
          </DialogContent>
        </Dialog>
      </div>
    )
}