"use client";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useAuth } from "@/Context/authContext/authContext";
import { Button } from "@/components/ui/button";
import { doSignOut } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Grid, Home, ListCollapse, Plus, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type GlobelContext = {
  setGridLayout: Function;
  GridLayout: boolean;
  selectedNote: {
    id: string;
    title: string;
    content: string;
    pinned: boolean;
  };
};

type AuthProps = {
  currentUser: any;
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const { setGridLayout, GridLayout, selectedNote }: GlobelContext =
    useGlobalContext() as GlobelContext;
  const { currentUser }: AuthProps = useAuth() as AuthProps;
  const [isHome, setIsHome] = useState<boolean>(true);
  const [indivisualNoteTitle, setIndivisualNoteTitle] = useState<string>("");

  useEffect(() => {
    pathname.split("Home/")[1] === undefined
      ? setIsHome(true)
      : setIsHome(false);
  }, [pathname]);

  useEffect(() => {
    setIndivisualNoteTitle(selectedNote?.title);
  }, [selectedNote]);
  return (
    <div className="flex">
      <aside className="flex flex-col p-3 justify-between h-dvh border-r-2 max-sm:hidden">
        <div className="flex flex-col items-center">
          <div className="my-8" />

          <Button
            variant={"outline"}
            className={`p-3 m-1`}
            onClick={() => {
              router.push("/Home");
            }}
          >
            <Home />
          </Button>

          <Button
            variant={"outline"}
            className={`p-3 m-1 text-indigo-800 dark:text-indigo-500`}
            onClick={() => {
              router.push("/Home/Create");
            }}
          >
            <Plus />
          </Button>
          <Button
            variant={"outline"}
            className={`p-3 m-1 max-sm:hidden`}
            onClick={() => {
              setGridLayout(!GridLayout);
            }}
          >
            {!GridLayout ? <Grid /> : <ListCollapse />}
          </Button>
        </div>
        <Button
          variant={"outline"}
          className={`p-3 m-1`}
          onClick={() => {
            router.push("/Settings");
          }}
        >
          <Settings />
        </Button>
      </aside>

      <div className="flex flex-col w-full">
        <header className="h-[75px] p-2 border-b-2 flex justify-between items-center px-5">
          {isHome ? (
            <p
              className="text-3xl text-indigo-500 cursor-pointer"
              onClick={() => {
                router.push("/Home");
              }}
            >
              Your notes
            </p>
          ) : (
            <input
              className="h-full w-full focus:outline-none text-3xl capitalize  text-indigo-500 dark:bg-transparent"
              type="text"
              value={indivisualNoteTitle}
              onChange={(e) => {
                setIndivisualNoteTitle(e.target.value);
              }}
              onBlur={async () => {
                selectedNote.id &&
                  (await updateDoc(
                    doc(
                      db,
                      "users/" + currentUser?.uid,
                      "notes",
                      selectedNote.id
                    ),
                    {
                      title: indivisualNoteTitle,
                    }
                  ));
              }}
            />
          )}
          <Button
            variant={"ghost"}
            onClick={async () => {
              await doSignOut();
            }}
            className={`${!isHome && "hidden"}`}
          >
            Log out
          </Button>
        </header>
        <section className="w-full">{children}</section>
      </div>
    </div>
  );
}
