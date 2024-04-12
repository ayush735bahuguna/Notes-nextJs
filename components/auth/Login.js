"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Github, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "../ui/toast";
import { useAuth } from "@/Context/authContext/authContext";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "@/lib/auth";

export default function Login() {
  const router = useRouter();
  const { UserloggedIn } = useAuth();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const { toast } = useToast();

  const guestUserDetails = (e) => {
    e.preventDefault();
    setemail("user123@gmail.com");
    setpassword("user123");
  };

  useEffect(() => {
    UserloggedIn && router.replace("/Home");
  }, [UserloggedIn]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setisLoading(true);

    if (!email || !password) {
      toast({
        title: `Please enter all required Details`,
        action: <ToastAction altText="close">Close</ToastAction>,
      });
      setisLoading(false);
      return;
    }

    try {
      await doSignInWithEmailAndPassword(email, password);

      toast({
        title: `logged in`,
        action: <ToastAction altText="close">Close</ToastAction>,
      });
      router.replace("/Home");
    } catch (error) {}
    setisLoading(false);
  };

  const SignWithGoogleHandler = async () => {
    await doSignInWithGoogle();
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Login to your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to login in to your account
        </p>
      </div>

      <div className={"grid gap-6"}>
        <form onSubmit={submitHandler}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoCorrect="off"
                value={email}
                onChange={(e) => {
                  setemail(e.target.value);
                }}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="password1">
                Password
              </Label>
              <Input
                id="password1"
                type="password"
                placeholder="Password"
                autoCapitalize="none"
                autoCorrect="off"
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                disabled={isLoading}
                variant={"outline"}
                onClick={guestUserDetails}
              >
                Get test user credentials
              </Button>

              <Button disabled={isLoading} type="submit">
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Log In
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" onClick={SignWithGoogleHandler}>
        Google
      </Button>
    </>
  );
}
