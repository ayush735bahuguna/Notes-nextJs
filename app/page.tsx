"use client";

import { useState } from "react";
import Login from "@/components/auth/Login";
import SignUp from "@/components/auth/SignUp";
import { Button } from "@/components/ui/button";
import { Code, Github } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const [logSign, setlogSign] = useState(true);

  return (
    <div className="container relative h-[100vh] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Button
        variant={"outline"}
        onClick={() => {
          setlogSign(!logSign);
        }}
        className={"absolute right-4 top-4 md:right-8 md:top-8"}
      >
        {logSign ? "Login" : "Sign Up"}
      </Button>

      <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r">
        <div className="absolute inset-0" />

        <div className="relative z-20 flex items-center text-lg font-medium">
          <Code /> &nbsp; Authentication
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Cum reiciendis quis eius temporibus dolor quidem accusantium est
              vitae, porro excepturi? Aut excepturi animi quis ipsa corrupti
              dolores praesentium voluptatibus accusantium?.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {logSign ? <Login /> : <SignUp />}

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
