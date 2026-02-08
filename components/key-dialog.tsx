import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function APIKeyDialog({title}: {title: string}) {
  return (
    <AlertDialog className="text-black bg-background" >
      <AlertDialogTrigger asChild>
        <Button  variant="">{title}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Connect your API key</AlertDialogTitle>
          <AlertDialogDescription>
             Get your API key from the GoogleAI Studio
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* <AlertDialogContent> */}
            <Label>API key</Label>
            <Input placeholder="API KEY"/>
        {/* </AlertDialogContent> */}
        <AlertDialogFooter>
          <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
          <AlertDialogAction>Allow</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
