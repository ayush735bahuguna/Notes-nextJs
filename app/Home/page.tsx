"use client";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useAuth } from "@/Context/authContext/authContext";
import { DeleteNotesDialog } from "@/components/Home/DeleteNotesDialog";
import Note from "@/components/Note";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { Loader, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";

type AuthUser = {
  currentUser: any;
};
type GlobalContext = {
  GridLayout: boolean;
};
type noteType = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
};

export default function Page(): React.JSX.Element {
  const { currentUser }: AuthUser = useAuth() as AuthUser;
  const router = useRouter();
  const { GridLayout }: GlobalContext = useGlobalContext() as GlobalContext;
  const [notes, setNotes] = useState<Array<noteType>>([]);
  const [allNotes, setAllNotes] = useState<Array<noteType>>([]);
  const [pinnedNotes, setpinnedNotes] = useState<Array<noteType>>([]);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [SearchedNotes, setSearchedNotes] = useState<Array<noteType>>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [deleteNoteModelTrigger, setDeleteNoteModelTrigger] =
    useState<boolean>(false);
  const notesContainerStyle: string = !GridLayout
    ? "columns-1"
    : `lg:columns-3 sm:columns-2 max-sm:columns-1 ps-1`;

  const fetchNotes = async () => {
    setLoading(true);
    const q = query(collection(db, "users/" + currentUser?.uid, "notes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let notesItemsArr: noteType[] = [];

      querySnapshot.forEach((doc) => {
        notesItemsArr.push({ ...doc.data(), id: doc.id } as noteType);
      });
      setLoading(true);
      setAllNotes(notesItemsArr);
      setNotes(notesItemsArr.filter((e) => !e.pinned));
      setpinnedNotes(notesItemsArr.filter((e) => e.pinned));
      setLoading(false);
      return () => unsubscribe();
    });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const SearchHandler: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      setSearchedNotes(
        allNotes.filter((e) =>
          e.title.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      return;
    }

    let filterTimeout;
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      setSearchedNotes(
        allNotes.filter((e) =>
          e.title.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }, 700);
  };

  return (
    <section className="flex items-center  justify-between flex-col w-full">
      <DeleteNotesDialog
        deleteNoteModelTrigger={deleteNoteModelTrigger}
        setDeleteNoteModelTrigger={setDeleteNoteModelTrigger}
        deleteNoteId={deleteNoteId}
      />

      <div
        className="overflow-x-hidden overflow-y-scroll ps-1 pe-2 w-full"
        style={{ height: "calc(100dvh - 85px)" }}
      >
        <header className="border-b-2 h-[65px] p-2 flex justify-between items-center w-full gap-5 px-5">
          <span className="flex items-center gap-2 border-spacing-1 w-full px-2">
            <Search />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              onKeyDown={SearchHandler}
              className="w-full p-2 focus:outline-none rounded-xl dark:ps-4"
            />
          </span>
          <Button
            variant={"outline"}
            onClick={() => {
              router.push("/Home/Create");
            }}
          >
            Add new note
          </Button>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center w-full h-[200px]">
            <span className="flex gap-1">
              <Loader className="animate-spin" /> Loading...
            </span>
          </div>
        ) : (
          <>
            {searchText ? (
              <>
                {SearchedNotes.length === 0 ? (
                  <div className="flex items-center justify-center w-full h-[200px]">
                    No result found
                  </div>
                ) : (
                  <React.Fragment>
                    <div className={notesContainerStyle}>
                      {SearchedNotes?.map((note: noteType, i: number) => {
                        return (
                          <div className="break-inside-avoid" key={i}>
                            <Note
                              note={note}
                              index={i}
                              setDeleteNoteModelTrigger={
                                setDeleteNoteModelTrigger
                              }
                              setDeleteNoteId={setDeleteNoteId}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </React.Fragment>
                )}
              </>
            ) : (
              <>
                {pinnedNotes.length !== 0 && (
                  <React.Fragment>
                    <p className="m-2 text-muted-foreground">Pinned notes</p>
                    <div className={`${notesContainerStyle} border-b-2`}>
                      {pinnedNotes?.map((note: noteType, i: number) => {
                        return (
                          <div className="break-inside-avoid" key={i}>
                            <Note
                              note={note}
                              index={i}
                              setDeleteNoteModelTrigger={
                                setDeleteNoteModelTrigger
                              }
                              setDeleteNoteId={setDeleteNoteId}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </React.Fragment>
                )}

                <div className={notesContainerStyle}>
                  {notes.length === 0 ? (
                    <div className="flex items-center justify-center w-full mt-10">
                      No notes{" "}
                    </div>
                  ) : (
                    <>
                      {notes.map((note: noteType, i: number) => {
                        return (
                          <div className="break-inside-avoid" key={i}>
                            <Note
                              note={note}
                              index={i}
                              setDeleteNoteModelTrigger={
                                setDeleteNoteModelTrigger
                              }
                              setDeleteNoteId={setDeleteNoteId}
                            />
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>

                {notes.length !== 0 && (
                  <p className="text-muted-foreground text-sm text-center m-7">
                    End of notes
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
