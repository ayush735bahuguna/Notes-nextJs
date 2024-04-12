import { useAuth } from "@/Context/authContext/authContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
type props = {
  deleteNoteModelTrigger: boolean;
  setDeleteNoteModelTrigger: Function;
  deleteNoteId: string | null;
};

type AuthProps = {
  currentUser: any;
};

export function DeleteNotesDialog({
  deleteNoteModelTrigger,
  setDeleteNoteModelTrigger,
  deleteNoteId,
}: props) {
  const { currentUser }: AuthProps = useAuth() as AuthProps;
  const router = useRouter();

  const deleteItem = async () => {
    if (deleteNoteId !== null) {
      await deleteDoc(
        doc(db, "users/" + currentUser?.uid, "notes", deleteNoteId)
      );
    }
    router.push("/Home");
    setDeleteNoteModelTrigger(false);
  };

  return (
    <AlertDialog
      open={deleteNoteModelTrigger}
      onOpenChange={(open: boolean) => {
        setDeleteNoteModelTrigger(open);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this note
            and remove from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            className="m-1"
            onClick={() => {
              setDeleteNoteModelTrigger(false);
            }}
          >
            cancel
          </Button>
          <Button variant={"destructive"} className="m-1" onClick={deleteItem}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
