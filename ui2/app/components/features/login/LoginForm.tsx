import { object, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
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
import { action } from "~/routes/login";
import { useEffect, useState } from "react";

const formSchema = z.object({
  username: z.string().min(2, { message: "Username is required." }).max(100),
  password: z.string().min(2, { message: "Password is required." }).max(100),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof actionData === "object" && "ok" in actionData) {
      if (actionData.ok) {
        toast.success("Successfully logged in! Redirecting to dashboard...");
        setTimeout(() => setSuccess(true), 2500);
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  }, [actionData]);

  useEffect(() => {
    if (success) navigate("/dashboard/home");
  }, [success]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    submit(values, { method: "POST" });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)] px-4 w-[400px] maw-w-[500px]">
      <Card className="w-full shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] rounded-2xl transition-all">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome Back 👋
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        className="bg-white dark:bg-[#2b2b2b] focus:ring-2 focus:ring-indigo-500"
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
                    <FormLabel className="font-semibold">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                        className="bg-white dark:bg-[#2b2b2b] focus:ring-2 focus:ring-indigo-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button type="submit" className="w-full" variant="green">
                  Login
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate("/register")}
                  variant="indigo"
                >
                  Register
                </Button>
              </div>

              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgot")}
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
