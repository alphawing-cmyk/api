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
import { Plus } from "lucide-react";
import {
  useActionData,
  useLoaderData,
  useMatches,
  useSubmit,
} from "@remix-run/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { loader } from "~/routes/dashboard/accounts/route";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { action } from "~/routes/dashboard/api/route";
import { useToast } from "~/hooks/use-toast";

const formSchema = z.object({
  serviceLevel: z.enum(["service_account", "live_account", "paper_account"], {
    errorMap: (issue, ctx) => ({ message: "Service level is required" }),
  }),
  apiKey: z.string().optional(),
  secret: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiration: z.string().optional(),
  state: z.string().optional(),
  scope: z.string().optional(),
  nickname: z.string().optional(),
  platform: z.enum(
    [
      "tradestation",
      "alpaca",
      "coinbase",
      "interactive_brokers",
      "oanda",
      "kraken",
    ],
    {
      errorMap: (issue, ctx) => ({ message: "Platform is required" }),
    }
  ),
  status: z.enum(["active", "disabled"], {
    errorMap: (issue, ctx) => ({ message: "Status is required" }),
  }),
  action: z.string().default("add_api_link"),
  userId: z.number().optional(),
});

const AddApiConnection = () => {
  const { toast } = useToast();
  const actionData = useActionData<typeof action>();
  const { serviceTypes, platforms } = useLoaderData<typeof loader>();
  const matches = useMatches();
  const layoutData = matches.find(
    (match) => match.id === "routes/dashboard/_layout"
  );
  const [role, setRole] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const submit = useSubmit();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceLevel: "paper_account",
      apiKey: "",
      secret: "",
      accessToken: "",
      refreshToken: "",
      expiration: "",
      state: "",
      scope: "",
      nickname: "",
      userId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    submit(values, { method: "POST" });
  };

  useEffect(() => {
    if (
      layoutData?.data &&
      typeof layoutData.data === "object" &&
      "role" in layoutData.data
    ) {
      setRole(layoutData.data.role as string);
    }
    if (
      layoutData?.data &&
      typeof layoutData.data === "object" &&
      "id" in layoutData.data
    ) {
      form.reset({
        ...form.getValues(),
        userId: layoutData.data.id as number,
      });
    }
  }, [layoutData]);

  useEffect(() => {
    if (actionData && "success" in actionData && actionData.success) {
      toast({
        title: "Success",
        description: "Successfully added api connection.",
        variant: "success",
      });
      form.reset({
        serviceLevel: "paper_account",
        apiKey: "",
        secret: "",
        accessToken: "",
        refreshToken: "",
        expiration: "",
        state: "",
        scope: "",
        nickname: "",
        userId: userId,
      });
    } else if (actionData && "success" in actionData && !actionData.success) {
      toast({
        title: "Error",
        description: "Could not add api connection, please try again.",
        variant: "destructive",
      });
    }
  }, [actionData]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="text-xs md:text-sm">
          <Plus className="mr-2 h-4 w-4" /> Add Api Connection
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Api Connection</SheetTitle>
          <SheetDescription>
            Below fill in the required fields to link your new api connection.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceLevel"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Service Level</FormLabel>
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
                          {serviceTypes.map((b: string, idx: number) =>
                            role === "admin" && b === "service_account" ? (
                              <SelectItem
                                value={b}
                                className="capitalize"
                                key={idx}
                              >
                                {b.replace("_", " ")}
                              </SelectItem>
                            ) : (
                              <SelectItem
                                value={b}
                                className="capitalize"
                                key={idx}
                              >
                                {b.replace("_", " ")}
                              </SelectItem>
                            )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="w-full col-span-4" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input className="col-span-3" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Api Key</FormLabel>
                  <FormControl>
                    <Input className="col-span-3" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secret"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Secret</FormLabel>
                  <FormControl>
                    <Input className="col-span-3" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accessToken"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Access Token</FormLabel>
                  <FormControl>
                    <Input className="col-span-3" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="refreshToken"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Refresh Token</FormLabel>
                  <FormControl>
                    <Input className="col-span-3" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiration"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Expiration</FormLabel>
                  <FormControl>
                    <Input
                      className="col-span-3"
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input className="col-span-3" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Scope</FormLabel>
                  <FormControl>
                    <Input className="col-span-3" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 capitalize">
                          <SelectValue placeholder="Select a Platform" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectGroup>
                          {platforms.map((b: string, idx: number) => (
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
                  <FormMessage className="w-full col-span-4" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 capitalize">
                          <SelectValue placeholder="Connection Status" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="w-full col-span-4" />
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

export default AddApiConnection;
