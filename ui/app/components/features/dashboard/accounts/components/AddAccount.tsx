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
import { Plus, AlertCircle } from "lucide-react";
import { useLoaderData, useMatches, useSubmit } from "@remix-run/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { loader } from "~/routes/dashboard.accounts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  accountNum: z.string().min(2, { message: "Account Number is required." }),
  nickname: z.string().optional(),
  broker: z.string().nonempty(),
  dateOpened: z.string(),
  initialBalance: z.number().default(0.0),
  currentBalance: z.number().default(0.0),
  accountType: z.string().default("paper_account"),
  autoTrade: z.string().default("yes"),
  action: z.string().default("add_account"),
});

const AddAccount = () => {
  const { brokers } = useLoaderData<typeof loader>();
  const matches = useMatches();
  const layoutData = matches.find(
    (match) => match.id === "routes/dashboard/_layout"
  );
  const [role, setRole] = useState<string | undefined>(undefined);
  const submit = useSubmit();

  useEffect(() => {
    console.log(layoutData);
    if (
      layoutData?.data &&
      typeof layoutData.data === "object" &&
      "role" in layoutData.data
    ) {
      setRole(layoutData.data.role as string);
    }
  }, [layoutData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNum: "",
      nickname: "",
      dateOpened: format(new Date(), "yyyy-MM-dd"),
      autoTrade: "false"
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    submit(values, {method: "POST"});
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="text-xs md:text-sm">
          <Plus className="mr-2 h-4 w-4" /> Add New Account
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Account</SheetTitle>
          <SheetDescription>
            Below fill in the required fields to link your new account.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="accountNum"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-1 mt-2">
                  <FormLabel>Account Number</FormLabel>
                  <FormControl className="">
                    <Input
                      className="col-span-3"
                      type="text"
                      placeholder="1234XXXXX"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Nickname</FormLabel>
                  <FormControl className="">
                    <Input
                      className="col-span-3"
                      type="text"
                      placeholder="Account 1A"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="broker"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Broker</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 capitalize">
                          <SelectValue placeholder="Select a Broker" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectGroup>
                          {brokers.map((b: string, idx: number) => (
                            <SelectItem
                              value={b}
                              className="capitalize"
                              key={idx}
                            >
                              {b.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOpened"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Date Opened</FormLabel>
                  <FormControl>
                    <Input className="col-span-3" type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialBalance"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Initial Balance</FormLabel>
                  <FormControl>
                    <Input
                      className="col-span-3"
                      type="number"
                      placeholder="$5000.00"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentBalance"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Current Balance</FormLabel>
                  <FormControl>
                    <Input
                      className="col-span-3"
                      type="number"
                      placeholder="$5000.00"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 capitalize">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectGroup>
                          <SelectItem
                            value="paper_account"
                            className="capitalize"
                          >
                            Paper Account
                          </SelectItem>
                          <SelectItem
                            value="live_account"
                            className="capitalize"
                          >
                            Live Account
                          </SelectItem>
                          {role === "admin" ? (
                            <SelectItem
                              value="service_account"
                              className="capitalize"
                            >
                              Service Account
                            </SelectItem>
                          ) : (
                            <></>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="autoTrade"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Auto Trade</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 capitalize">
                          <SelectValue placeholder="Automated Trading?" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="true" className="capitalize">
                            Yes
                          </SelectItem>
                          <SelectItem value="false" className="capitalize">
                            No
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("autoTrade") === "true" && (
              <Alert variant="destructive" className="col-span-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Notice</AlertTitle>
                <AlertDescription>
                  If you have allowed for auto trading on this account, you will
                  need to ensure that you have set your API credentials as well
                  in the API manager.
                </AlertDescription>
              </Alert>
            )}

            <SheetFooter>
              <Button type="submit">Submit</Button>
              <SheetClose asChild>
                <Button type="button" variant="secondary">Close</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default AddAccount;