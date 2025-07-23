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
import { useActionData, useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { action } from "~/routes/forgot/route";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().min(2, { message: "Email is required." }),
});

const ForgotForm = () => {
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    submit(
      { ...values, origin: window.location.origin },
      {
        method: "POST",
      }
    );
  };

  useEffect(() => {
    if (actionData && "success" in actionData && actionData.success) {
      toast.success("We will send you an email if email account exists.", {
        description: "",
        duration: 2000,
      });
      setSuccess(true);
    } else if (actionData && "success" in actionData && !actionData.success) {
      toast.error("Could not process, please try again later.", {
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

  return (
    <>
      <Card className="sm:min-w-[300px] md:min-w-[500px] p-4">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      className="bg-white"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button type="submit" className="ml-2" variant="green">
                Send
              </Button>
              <Button
                type="button"
                onClick={() => {
                  navigate("/login");
                }}
                className="ml-2"
                variant="indigo"
              >
                Back to Login
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default ForgotForm;
