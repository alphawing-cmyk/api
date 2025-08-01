import {
  useActionData,
  useLoaderData,
  useMatches,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "~/components/ui/dialog";
import { useToast } from "~/hooks/use-toast";
import { Input } from "~/components/ui/input";
import { action, loader } from "~/routes/dashboard.accounts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { format, parseISO } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { AlertCircle } from "lucide-react";
import { AccountCols } from "./Columns";

const formSchema = z.object({
  id: z.number(),
  accountNum: z.string().min(2, { message: "Account Number is required." }),
  nickname: z.string().optional(),
  broker: z.string().nonempty(),
  dateOpened: z.string(),
  initialBalance: z.number().default(0.0),
  currentBalance: z.number().default(0.0),
  accountType: z.string().default("paper_account"),
  autoTrade: z.string().default("yes"),
  action: z.string().default("edit_account"),
});

function EditAccountAction({
  id,
  accountNum,
  accountType,
  autoTrade,
  nickname,
  broker,
  dateOpened,
  initialBalance,
  currentBalance,
}: AccountCols) {
  const submit = useSubmit();
  const matches = useMatches();
  const actionData = useActionData<typeof action>();
  const success = actionData?.action === "edit_account" && actionData?.success;
  const error = actionData?.action === "edit_account" && !actionData?.success;
  const { toast } = useToast();
  const { brokers } = useLoaderData<typeof loader>();
  const [role, setRole] = useState<string | undefined>(undefined);
  const layoutData = matches.find(
    (match) => match.id === "routes/dashboard/_layout"
  );

  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        description: "You have successfully updated the account.",
        variant: "success",
      });
    }

    if (error) {
      toast({
        title: "Failed",
        description: "Could not update account, please try again.",
        variant: "destructive",
      });
    }
  }, [success, error]);

  useEffect(() => {
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
      accountNum: accountNum,
      nickname: nickname,
      dateOpened: dateOpened ? format(parseISO(dateOpened), "yyyy-MM-dd") : "",
      autoTrade: autoTrade ? "true" : "false",
      broker,
      accountType,
      initialBalance,
      currentBalance,
      id,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    submit(values, { method: "POST" });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="indigo" type="button">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogDescription>
            Able to edit your account information.
          </DialogDescription>
          <DialogHeader>
            <DialogTitle>Edit your account</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" type="number" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountNum"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-1 mt-2">
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
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
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
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
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
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
                    If you have allowed for auto trading on this account, you
                    will need to ensure that you have set your API credentials
                    as well in the API manager.
                  </AlertDescription>
                </Alert>
              )}
              <DialogFooter>
                <Button variant="default" type="submit">
                  Submit
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EditAccountAction;
