import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { useToast } from "~/hooks/use-toast";

const Signup = () => {
  const [email, setEmail] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast()

  useEffect(()=>{
     if(success){
      toast({
        title: "Success",
        description: "You have successfully signed up.",
        variant: "success"
      });
      setEmail("");
      setSuccess(false);
     }

  },[success])

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const submit = () => {
    setSuccess(true);
  };

  return (
    <div className="w-full py-16 mt-32 text-white px-4 bg-tmLightBlack">
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-3">
        <div className="lg:col-span-2 my-4">
          <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold py-2">
            Want to stay up to date on the latest platform enhancements?
          </h1>
          <p>Sign up to our newsletter and stay up to date.</p>
        </div>
        <div className="my-4">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full">
            <input
              type="email"
              placeholder="Enter Email"
              className="p-3 flex w-full rounded-md text-black"
              onChange={handleEmail}
            />
            <button
              className="text-black bg-tmGolden w-[200px] rounded-md font-medium ml-4 my-6 px-6 py-3"
              onClick={submit}
            >
              Notify Me
            </button>
          </div>
          <p>
            We care about the protection of your data. Read our
            <span
              className="text-[#00df9a] ml-1 cursor-pointer"
              onClick={() => {
                navigate("/privacy");
              }}
            >
              Privacy Policy.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;