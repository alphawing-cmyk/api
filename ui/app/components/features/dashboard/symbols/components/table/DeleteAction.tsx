import { useState, useEffect } from "react";
import { useActionData, useSubmit } from "@remix-run/react";
import { action } from "~/routes/dashboard.symbols";
import { useToast } from "~/hooks/use-toast";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export const DeleteAction = ({ data }: any) => {
  const actionData = useActionData<typeof action>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const submit = useSubmit();
  const { toast } = useToast();

  const handleDelete = () => {
    submit({ action: "delete_symbol", id: data.id }, { method: "DELETE" });
  };

  useEffect(() => {
    if (
      actionData &&
      "success" in actionData &&
      "action" in actionData &&
      actionData.action === "delete_symbol"
    ) {
      if (actionData.success) {
        toast({
          title: "Success",
          description: "Successfully deleted symbol.",
          variant: "success",
        });
        setIsOpen(false);
      } else {
        toast({
          title: "Error",
          description: "Could not delete symbol, please try again.",
          variant: "destructive",
        });
      }
    }
  }, [actionData]);

  return (
    <div className="flex justify-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-4xl max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Record Deletion</DialogTitle>
            <DialogDescription>
              Deleting this ticker will erase all historical data, however existing trade
              information will be retained for both existing and current trades.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <h3 className="text-lg font-semibold">Are you sure you want to proceed?</h3>
          </div>

          <div className="overflow-x-auto w-full">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[100px]">Symbol</TableHead>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead className="w-[100px]">Industry</TableHead>
                  <TableHead className="w-[100px]">Market</TableHead>
                  <TableHead className="w-[100px]">Market Cap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{data.id + 1}</TableCell>
                  <TableCell className="font-medium">{data.symbol}</TableCell>
                  <TableCell className="font-medium">{data.name.slice(0, 10)}</TableCell>
                  <TableCell className="font-medium">{data?.industry}</TableCell>
                  <TableCell className="font-medium">{data.market}</TableCell>
                  <TableCell className="font-medium">{data?.market_cap}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="default" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
