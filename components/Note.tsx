import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { Edit, Pin, PinOff, Trash, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/Context/authContext/authContext";
// import { format } from 'timeago.js'

type Props = {
  index: number;
  setDeleteNoteModelTrigger: Function;
  setDeleteNoteId: Function;
  note: { id: string; title: string; content: string; pinned: boolean };
};
export default function Note({
  note,
  index,
  setDeleteNoteModelTrigger,
  setDeleteNoteId,
}: Props) {
  const { GridLayout, setSelectedNote } = useGlobalContext();
  const { currentUser } = useAuth();
  const router = useRouter();

  const PinNotesHandler = async () => {
    await updateDoc(doc(db, "users/" + currentUser?.uid, "notes", note.id), {
      pinned: true,
    });
  };

  const unPinNotesHandler = async () => {
    await updateDoc(doc(db, "users/" + currentUser?.uid, "notes", note.id), {
      pinned: false,
    });
  };

  return (
    <span
      className={` ${
        GridLayout ? "lg:w-1/3 sm:w-1/2 xl:w-1/4" : "w-full"
      } p-2 `}
    >
      <div
        className={`border-2  rounded-xl p-3 dark:border-slate-700 relative cursor-pointer box-border dark:hover:bg-slate-900 ${
          note.pinned
            ? "hover:border-yellow-600 dark:hover:border-yellow-600 border-yellow-300 hover:bg-yellow-50/40"
            : "hover:border-indigo-600 dark:hover:border-indigo-600 border-indigo-200 hover:bg-sky-50/70"
        } `}
      >
        {!note.pinned && (
          <span className="text-5xl font-bold text-slate-300 absolute -bottom-1 left-0">
            {index + 1}
          </span>
        )}

        <h4 className="text-2xl capitalize ">{note.title}</h4>
        {!note.pinned ? (
          <Pin
            className="absolute -top-2 right-0 text-indigo-500"
            onClick={PinNotesHandler}
          />
        ) : (
          <PinOff
            className="absolute -top-2 right-0 text-yellow-500"
            onClick={unPinNotesHandler}
          />
        )}
        <div
          className="text-slate-500 dark:text-slate-400 mt-1 whitespace-break-spaces overflow-clip pb-2"
          onClick={() => {
            setSelectedNote(note);
            router.push(`/Home/${note.id}`);
          }}
        >
          {note.content}
        </div>

        <div>
          {/* <p className="text-muted-foreground text-right pb-2">2 days ago</p> */}
          <div className="flex gap-4 justify-end">
            <Trash2
              color="red"
              onClick={() => {
                setDeleteNoteId(note.id);
                setDeleteNoteModelTrigger(true);
              }}
            />
          </div>
        </div>
      </div>
    </span>
  );
}
