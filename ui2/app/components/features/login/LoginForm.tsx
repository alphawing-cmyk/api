import { object, z } from "zod";
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
import { useNavigate, useSubmit, useActionData } from "@remix-run/react";
import { toast } from "sonner";
import { action } from "~/routes/login/route";
import { useEffect, useState } from "react";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username is required." })
    .max(100, { message: "Max Limit is 100 characters" }),
  password: z
    .string()
    .min(2, { message: "Password is required." })
    .max(100, { message: "max limit is 100 characters" }),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loginUser() {
      if (
        typeof actionData === "object" &&
        "ok" in actionData &&
        actionData.ok
      ) {
        toast.success(
          "Successfully logged in, you will be redirected to the home screen.",
          {
            description: "",
            duration: 2000,
          }
        );

        setTimeout(() => {
          setSuccess(true); // Ensure success state reflects correctly
        }, 2500);
      } else if (
        typeof actionData === "object" &&
        "ok" in actionData &&
        !actionData?.ok
      ) {
        toast.error("Could not log you in, please try again", {
          description: "",
          duration: 2000,
        });
      }
    }
    loginUser();
  }, [actionData]);

  useEffect(() => {
    if (success === true) {
      navigateToDashboard();
    }
  }, [success]);

  const navigateToDashboard = () => {
    navigate("/dashboard/home");
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    submit(values, {
      method: "POST",
    });
  };

  return (
    <>
      <Card className="sm:min-w-[300px] md:min-w-[500px] p-4">
        <CardHeader>
          <CardTitle>Login Here</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      className="bg-white"
                    />
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
                  <FormLabel className="font-bold">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      {...field}
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button type="submit" className="text-white" variant="green">
                Login
              </Button>
              <Button
                type="button"
                onClick={() => {
                  navigate("/register");
                }}
                className="ml-2"
                variant="indigo"
              >
                Register
              </Button>
            </div>
            <div className="text-center">
              <a
                href="#"
                className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                onClick={()=>{ navigate('/forgot') }}
              >
                Reset Password
              </a>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default LoginForm;
