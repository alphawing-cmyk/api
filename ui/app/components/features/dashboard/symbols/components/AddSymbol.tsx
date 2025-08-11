import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Plus } from "lucide-react";
import {
  useActionData,
  useLoaderData,
  useMatches,
  useSubmit,
} from "@remix-run/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useEffect, useState } from "react";
import {
  useForm,
  useFieldArray,
  ControllerRenderProps,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { action } from "~/routes/dashboard.symbols";
import { useToast } from "~/hooks/use-toast";

const formSchema = z.object({
  symbol: z.string().min(1, { message: "Ticker symbol is required." }),
  name: z.string().min(1, { message: "Ticker name is required." }),
  industry: z.string().optional(),
  market: z.string().min(2, { message: "Market is required." }),
  market_cap: z.string().optional(),
  action: z.string().default("add_symbol"),
  alt_names: z
    .array(
      z.object({
        source: z.string().min(1),
        name: z.string().min(1),
      })
    )
    .optional(),
});

const AddASymbol = ({userRole}:{userRole: string | undefined}) => {
  const { toast } = useToast();
  const [role, setRole] = useState<string | undefined>(userRole);
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();

 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      name: "",
      industry: "",
      market: "",
      market_cap: "",
      alt_names: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "alt_names",
  });

  useEffect(() => {
    if (actionData && "success" in actionData && actionData.success) {
      toast({
        title: "Success",
        description: actionData.message,
        variant: "success",
      });
      form.reset({
        symbol: "",
        name: "",
        industry: "",
        market: "",
        market_cap: "",
        alt_names: [],
      });
    } else if (actionData && "success" in actionData && !actionData.success) {
      toast({
        title: "Error",
        description: actionData.message,
        variant: "destructive",
      });
    }
  }, [actionData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const payload = {
      ...values,
      alt_names: values.alt_names ? JSON.stringify(values.alt_names) : null,
    };

    submit(payload, { method: "POST" });
  };

  return (
    <Sheet>
      {role === "admin" ? (
        <SheetTrigger asChild>
          <Button className="text-xs md:text-sm">
            <Plus className="mr-2 h-4 w-4" /> Add New Symbol
          </Button>
        </SheetTrigger>
      ) : (
        <></>
      )}

      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Symbol</SheetTitle>
          <SheetDescription>
            Below fill in the required fields to link a new ticker symbol.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-1 mt-2">
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input
                      className="col-span-3"
                      type="text"
                      placeholder="BBY"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-1 mt-2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="col-span-3"
                      type="text"
                      placeholder="Bestbuy"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-1 mt-2">
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input
                      className="col-span-3"
                      type="text"
                      placeholder="Technology"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />
            <Controller
              name="market"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Market</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="col-span-3 capitalize">
                        <SelectValue placeholder="Select market" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="STOCK">Stock</SelectItem>
                          <SelectItem value="CRYPTO">Crypto</SelectItem>
                          <SelectItem value="FUTURES">Futures</SelectItem>
                          <SelectItem value="FOREX">Forex</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alt_names"
              render={({ field }) => (
                <div className="space-y-2">
                  <FormLabel className="text-base">Alternate Names</FormLabel>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-12 gap-2 items-center"
                    >
                      {/* Source */}
                      <FormField
                        control={form.control}
                        name={`alt_names.${index}.source`}
                        render={({ field }) => (
                          <FormItem className="col-span-4">
                            <FormLabel className="text-xs">Source</FormLabel>
                            <FormControl>
                              <Input placeholder="Yahoo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Alt Name */}
                      <FormField
                        control={form.control}
                        name={`alt_names.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="col-span-6">
                            <FormLabel className="text-xs">Alt Name</FormLabel>
                            <FormControl>
                              <Input placeholder="BBY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Remove Button */}
                      <div className="col-span-2 flex justify-center items-end h-full">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-red-500 text-[12px]"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="secondary"
                    className="ml-1 text-[12px]"
                    onClick={() => append({ source: "", name: "" })}
                  >
                    + Add Alt Name
                  </Button>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="market_cap"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-1 mt-2">
                  <FormLabel>Market Cap</FormLabel>
                  <FormControl>
                    <Input
                      className="col-span-3"
                      type="text"
                      placeholder="300K"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />

            <SheetFooter>
              <Button type="submit">Submit</Button>
              <SheetClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default AddASymbol;
