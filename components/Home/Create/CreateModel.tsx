"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ToastAction } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import { useAuth } from "@/Context/authContext/authContext";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

type AuthProps = {
  currentUser: any;
};

export default function CreateModal() {
  const routes = useRouter();
  const [trigger, settrigger] = useState<boolean>(true);
  const [loading, setloading] = useState<boolean>(false);
  const [title, settitle] = useState<string | undefined>(undefined);
  const [content, setcontent] = useState<string | undefined>(undefined);
  const pathname = usePathname();
  const { toast } = useToast();
  const { currentUser }: AuthProps = useAuth() as AuthProps;

  async function onSubmitHandler() {
    setloading(true);

    toast({
      title: `Creating new note...`,
      action: <ToastAction altText="close">Close</ToastAction>,
    });
    try {
      await addDoc(collection(db, "users/" + currentUser?.uid, "notes"), {
        title: title?.trim(),
        content: content,
        pinned: false,
        timestamp: serverTimestamp(),
      });

      toast({
        title: `Created`,
        action: <ToastAction altText="close">Close</ToastAction>,
      });
    } catch (error) {
      toast({
        title: `Error !`,
        action: <ToastAction altText="close">Close</ToastAction>,
      });
      setloading(false);
      console.log("errr : ", error);
      return;
    }
    setloading(false);
    routes.push("/Home");
  }

  useEffect(() => {
    if (pathname === "/Home/Create") {
      settrigger(true);
    } else {
      settrigger(false);
    }
  }, [pathname]);

  useEffect(() => {
    trigger ? "" : routes.push("/Home");
  }, [trigger]);

  return (
    <>
      <Dialog open={trigger} onOpenChange={settrigger}>
        <DialogContent className={"max-w-lg"}>
          <DialogHeader>
            <DialogTitle>
              {" "}
              <p className="text-2xl">New Note</p>
            </DialogTitle>
            <DialogDescription>Create a new Note</DialogDescription>
          </DialogHeader>
          <Input
            id="CreateInput"
            type="text"
            placeholder="Type title here..."
            value={title}
            disabled={loading}
            onChange={(e) => {
              settitle(e.target.value);
            }}
          />
          <Textarea
            placeholder="Type your notes here..."
            value={content}
            rows={10}
            onChange={(e) => {
              setcontent(e.target.value);
            }}
            className="whitespace-break-spaces"
            disabled={loading}
          />

          <DialogFooter className={"flex items-end justify-end flex-row gap-3"}>
            <Link href={"/Home"}>
              <Button
                variant={"outline"}
                onClick={() => {
                  settrigger(false);
                  redirect("/Home");
                }}
              >
                Close
              </Button>
            </Link>

            <Button
              onClick={onSubmitHandler}
              disabled={loading || content === undefined || content === ""}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
