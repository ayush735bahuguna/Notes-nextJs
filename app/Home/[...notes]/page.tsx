"use client";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useAuth } from "@/Context/authContext/authContext";
import { DeleteNotesDialog } from "@/components/Home/DeleteNotesDialog";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ArrowLeft, Pin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type noteType = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
};

type GlobelContext = {
  selectedNote: noteType;
  setSelectedNote: Function;
};

type AuthProps = {
  currentUser: any;
};

export default function Page() {
  const router = useRouter();
  const { currentUser }: AuthProps = useAuth() as AuthProps;
  const { selectedNote, setSelectedNote }: GlobelContext =
    useGlobalContext() as GlobelContext;
  const [note, setNote] = useState<noteType>();
  const [deleteNoteModelTrigger, setDeleteNoteModelTrigger] =
    useState<boolean>(false);

  const PinNotesHandler = async () => {
    await updateDoc(
      doc(db, "users/" + currentUser?.uid, "notes", selectedNote.id),
      {
        pinned: true,
      }
    );

    setSelectedNote((prevNote: noteType) => {
      if (!prevNote) {
        return prevNote;
      }

      const updatedNote: noteType = {
        ...prevNote,
        pinned: true,
      };

      return updatedNote;
    });
  };

  const unPinNotesHandler = async () => {
    await updateDoc(
      doc(db, "users/" + currentUser?.uid, "notes", selectedNote.id),
      {
        pinned: false,
      }
    );

    setSelectedNote((prevNote: noteType) => {
      if (!prevNote) {
        return prevNote;
      }

      const updatedNote: noteType = {
        ...prevNote,
        pinned: false,
      };

      return updatedNote;
    });
  };

  useEffect(() => {
    setNote(selectedNote);
  }, [selectedNote]);

  return (
    <div className="p-3">
      <DeleteNotesDialog
        deleteNoteModelTrigger={deleteNoteModelTrigger}
        setDeleteNoteModelTrigger={setDeleteNoteModelTrigger}
        deleteNoteId={selectedNote?.id}
      />

      <span className="flex gap-1 justify-between">
        <Button
          variant={"outline"}
          onClick={() => {
            router.push("/Home");
          }}
          className="mb-5 sm:hidden"
        >
          {" "}
          <ArrowLeft />{" "}
        </Button>
        <div className="max-sm:hidden" />
        <span className="flex gap-2 justify-end flex-wrap">
          <Button
            variant={"outline"}
            className="text-red-500"
            onClick={() => {
              setDeleteNoteModelTrigger(true);
            }}
          >
            <Trash2 size={20} /> &nbsp; Delete Note
          </Button>
          <Button variant={"outline"}>
            {!selectedNote.pinned ? (
              <span className="text-yellow-500 flex" onClick={PinNotesHandler}>
                <Pin size={20} /> &nbsp; Add to pinned
              </span>
            ) : (
              <span
                className="text-indigo-500 flex"
                onClick={unPinNotesHandler}
              >
                <Pin size={20} /> &nbsp; Remove from pinned
              </span>
            )}
          </Button>
        </span>
      </span>

      <textarea
        value={note?.content}
        onChange={(e) => {
          setNote((prevNote) => {
            if (!prevNote) {
              return prevNote;
            }
            const updatedNote: noteType = {
              ...prevNote,
              content: e.target.value,
            };

            return updatedNote;
          });
        }}
        onBlur={async () => {
          await updateDoc(
            doc(db, "users/" + currentUser?.uid, "notes", selectedNote?.id),
            {
              content: note?.content,
            }
          );
        }}
        className="w-full p-2 mt-2 focus:outline-none dark:bg-transparent"
        style={{ height: "calc(100dvh - 160px)" }}
      />
    </div>
  );
}
