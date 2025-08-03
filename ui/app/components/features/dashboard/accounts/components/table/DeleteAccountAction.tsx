import {  useActionData, useSubmit } from "@remix-run/react";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { useToast } from "~/hooks/use-toast";
import { action } from "~/routes/dashboard.accounts";

function DeleteAccountAction({ id }: { id: number }) {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const success =
    actionData?.action === "delete_account" && actionData?.success;
  const error = actionData?.action === "delete_account" && !actionData?.success;
  const { toast } = useToast();

  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        description: "You have successfully deleted the account.",
        variant: "success",
      });
    }

    if (error) {
      toast({
        title: "Failed",
        description: "Could not delete account, please try again.",
        variant: "destructive",
      });
    }
  }, [success, error]);

  const handleSubmit = () => {
    submit(
      { id: id, action: "delete_account" },
      { method: "POST", action: "/dashboard/accounts" }
    );
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" type="button">
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              Deleting this account record will cause all existing trades to
              close out, all trading records to be cleared for this account, and
              all records for this account is unrecoverable beyond this point.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="destructive"
                onClick={handleSubmit}
              >
                Continue
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DeleteAccountAction;
