import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  useNavigate,
  useSubmit,
  useActionData,
  useRouteLoaderData,
} from "@remix-run/react";
import { toast } from "sonner";
import { action } from "~/routes/register/route";
import { useEffect, useState } from "react";
import AckModal from "./AckModal";
import Spinner from "~/components/ui/spinner";
import { getRandomEmail, getRandomString } from "~/lib/utils";
import { loader } from "~/root";

const formSchema = z
  .object({
    first_name: z
      .string()
      .min(2, { message: "First Name is required." })
      .max(100, { message: "Max limit is 100 characters" }),
    last_name: z
      .string()
      .min(2, { message: "Last Name is required." })
      .max(100, { message: "Max limit is 100 characters" }),
    email: z.string().min(2, { message: "Email is required." }),
    username: z
      .string()
      .min(2, { message: "Username is required." })
      .max(100, { message: "Max Limit is 100 characters" }),
    password: z
      .string()
      .min(2, { message: "Password is required." })
      .max(100, { message: "max limit is 100 characters" }),
    company: z.string(),
    confirm_password: z
      .string()
      .min(2, { message: "Confirm password is required." }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

const RegisterForm = () => {
  const navigate = useNavigate();
  const submit = useSubmit();
  const rootLoaderData = useRouteLoaderData<typeof loader>("root");
  const actionData = useActionData<typeof action>();

  const { ENV } = rootLoaderData;
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (actionData && "success" in actionData && actionData.success) {
      toast.success(
        "Successfully registered, you will be redirected to the login screen.",
        {
          description: "",
          duration: 2000,
        }
      );
      setSuccess(true);
    } else if (actionData && "success" in actionData && !actionData.success) {
      toast.error("Could not register user account, please try again.", {
        description: "",
        duration: 2000,
      });
      setSuccess(false);
    }
  }, [actionData]);

  useEffect(() => {
    if (success === true) {
      navigateToLogin();
    }
  }, [success]);

  const navigateToLogin = () => {
    setTimeout(() => {
      navigate("/login");
    }, 2500);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      company: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
    },
  });
  const [ack, setAck] = useState<boolean>(false);

  const generateRandomData = () => {
    form.setValue("first_name", getRandomString(10));
    form.setValue("last_name", getRandomString(10));
    form.setValue("company", getRandomString(10));
    form.setValue("username", getRandomString(10));
    form.setValue("password", getRandomString(10));
    form.setValue("email", getRandomEmail());
    form.setValue("confirm_password", form.getValues("password"));
    setAck(true);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (ack) {
      submit(values, {
        method: "POST",
      });
    } else {
      toast.error("Please read and accept the conditions first.", {
        description: "",
        duration: 2000,
      });
    }
  };

  return (
    <>
      <Card className="sm:min-w-[300px] md:min-w-[500px] p-4 my-[100px]">
        <CardHeader>
          <CardTitle>Register Here</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@yahoo.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Company ABC" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AckModal accepted={ack} setAccepted={setAck} />
            {ENV.NODE_ENV === "development" && (
              <div className="my-[5px] flex justify-center">
                <Button
                  type="button"
                  variant="indigo"
                  onClick={generateRandomData}
                >
                  Generate Random User
                </Button>
              </div>
            )}

            <div className="flex flex-row justify-center pt-[20px]">
              <Button type="submit" disabled={!ack}>
                {loading ? (
                  <div className="mr-[5px]">
                    <Spinner color="blue-600" size="w-4 h-4" />
                  </div>
                ) : null}
                Submit
              </Button>
              <Button
                type="button"
                onClick={() => {
                  navigate("/forgot");
                }}
                className="ml-2"
                variant="indigo"
              >
                Forgot Password
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default RegisterForm;
