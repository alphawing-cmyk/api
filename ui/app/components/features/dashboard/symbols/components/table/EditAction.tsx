import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { Modal } from "~/components/ui/modal";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { useActionData, useMatches, useSubmit } from "@remix-run/react";
import { useToast } from "~/hooks/use-toast";
import { action } from "~/routes/dashboard/symbols/route";

interface EditData {
  id: number;
  symbol: string;
  name: string;
  industry?: string;
  market: string;
  market_cap?: string;
  action: string;
  alt_names?: { source: string; name: string }[];
}

export const EditAction = ({ data }: { [key: string]: any }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const { toast } = useToast();
  const [role, setRole] = useState<string | undefined>(undefined);

  const [editData, setEditData] = useState<EditData>({
    id: data.id,
    symbol: data.symbol,
    name: data.name,
    industry: data?.industry,
    market: data.market,
    market_cap: data?.market_cap,
    action: "edit_symbol",
  });

  const [altNames, setAltNames] = useState<{ source: string; name: string }[]>(
    data.alt_names || []
  );

  const onChange = (property: string, value: any) => {
    setEditData((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const updateAltName = (
    index: number,
    key: "source" | "name",
    value: string
  ) => {
    setAltNames((prev) => {
      const copy = [...prev];
      copy[index][key] = value;
      return copy;
    });
  };

  const addAltName = () => {
    setAltNames((prev) => [...prev, { source: "", name: "" }]);
  };

  const removeAltName = (index: number) => {
    setAltNames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    submit({ ...editData, alt_names: JSON.stringify(altNames) }, { method: "POST" });
  };

  const matches = useMatches();
  const layoutData = matches.find(
    (match) => match.id === "routes/dashboard/_layout"
  );

  useEffect(() => {
    if (
      layoutData?.data &&
      typeof layoutData.data === "object" &&
      "role" in layoutData.data
    ) {
      setRole(layoutData.data.role as string);
    }
  }, [layoutData]);

  useEffect(() => {
    if (
      actionData &&
      "success" in actionData &&
      actionData.success &&
      "action" in actionData &&
      actionData.action === "edit_symbol"
    ) {
      toast({
        title: "Success",
        description: "Successfully updated symbol.",
        variant: "success",
      });
      setIsOpen(false);
    } else if (
      actionData &&
      "success" in actionData &&
      !actionData.success &&
      "action" in actionData &&
      actionData.action === "edit_symbol"
    ) {
      toast({
        title: "Error",
        description: "Could not update symbol, please try again.",
        variant: "destructive",
      });
    }
  }, [actionData]);

  return (
    <div className="flex justify-center">
      <Button
        variant="default"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Edit
      </Button>

      <Modal
        title="Edit Symbol Info"
        description=""
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <ScrollArea className="h-[500px] p-3">
          {/* Symbol */}
          <div className="my-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              className="capitalize"
              defaultValue={editData.symbol}
              onChange={(e) => onChange("symbol", e.target.value)}
            />
          </div>

          {/* Name */}
          <div className="my-2">
            <Label htmlFor="name">Name</Label>
            <Input
              className="capitalize"
              defaultValue={editData.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>

          {/* Industry */}
          <div className="my-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              className="capitalize"
              defaultValue={editData.industry}
              onChange={(e) => onChange("industry", e.target.value)}
            />
          </div>

          {/* Market Cap */}
          <div className="my-2">
            <Label htmlFor="market_cap">Market Cap</Label>
            <Input
              defaultValue={editData.market_cap}
              onChange={(e) => onChange("market_cap", e.target.value)}
            />
          </div>

          {/* Market */}
          <div className="my-2">
            <Label htmlFor="market">Market</Label>
            <Select
              defaultValue={editData.market}
              onValueChange={(e) => onChange("market", e)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a market type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Market Type</SelectLabel>
                  <SelectItem value="STOCK" className="capitalize">
                    Stock
                  </SelectItem>
                  <SelectItem value="CRYPTO" className="capitalize">
                    Crypto
                  </SelectItem>
                  <SelectItem value="FUTURES" className="capitalize">
                    Futures
                  </SelectItem>
                  <SelectItem value="FOREX" className="capitalize">
                    Forex
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Alternate Names */}
          <div className="my-4">
            <Label>Alternate Names</Label>
            {altNames.length > 0 ? (
              altNames.map((alt, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-center my-2"
                >
                  <div className="col-span-5">
                    <Input
                      placeholder="Source"
                      value={alt.source}
                      onChange={(e) =>
                        updateAltName(index, "source", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-5">
                    <Input
                      placeholder="Name"
                      value={alt.name}
                      onChange={(e) =>
                        updateAltName(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant="ghost"
                      className="text-red-500 text-xs"
                      onClick={() => removeAltName(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs italic my-2">
                No alternate names
              </p>
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="text-xs mt-1"
              onClick={addAltName}
            >
              + Add Alt Name
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-4">
            <Button variant="default" className="mr-2" onClick={handleSubmit}>
              Submit
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Close
            </Button>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </Modal>
    </div>
  );
};
