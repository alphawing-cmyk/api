import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Modal } from "~/components/ui/modal";
import { useActionData, useSubmit } from "@remix-run/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { action } from "~/routes/dashboard/api/route";
import { useToast } from "~/hooks/use-toast";
import { useEffect } from "react";


export const DeleteAction = ({ data }: any) => {
  const actionData = useActionData<typeof action>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const submit = useSubmit();
  const { toast } = useToast();

  const handleDelete = async () => {
    setSuccess(null);
    submit({ action: "delete_symbol", id: data.id }, { method: "DELETE" });
  };

  useEffect(() => {
    if (
      actionData &&
      "success" in actionData &&
      actionData.success &&
      "action" in actionData &&
      actionData.action === "delete_symbol"
    ) {
      toast({
        title: "Success",
        description: "Successfully deleted symbol.",
        variant: "success",
      });
      setIsOpen(false);
    } else if (
      actionData &&
      "success" in actionData &&
      !actionData.success &&
      "action" in actionData &&
      actionData.action === "delete_symbol"
    ) {
      toast({
        title: "Error",
        description: "Could not delete symbol, please try again.",
        variant: "destructive",
      });
    }
  }, [actionData]);

  return (
    <div className="flex justify-center">
      <Button
        variant="destructive"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Delete
      </Button>

      <Modal
        title="Delete Symbol"
        description="Deleting this ticker will erase all historical data, however existing trade information will be retained for both existing trades / current trades."
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="my-2">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Are you sure you want to proceed?
          </h3>
        </div>
        <div className="my-2">
          <Table>
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
                <TableCell className="font-medium">{data.name}</TableCell>
                <TableCell className="font-medium">{data?.industry}</TableCell>
                <TableCell className="font-medium">{data.market}</TableCell>
                <TableCell className="font-medium">{data?.market_cap}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            variant="destructive"
            className="mr-2"
            onClick={() => {
              handleDelete();
            }}
          >
            Delete
          </Button>
          <Button
            variant="default"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};
