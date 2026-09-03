"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProperty } from "@/lib/actions";

export default function DeleteButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-label="Supprimer l'annonce"
      disabled={isPending}
      onClick={() => {
        if (confirm("Supprimer définitivement cette annonce ?")) {
          startTransition(() => deleteProperty(id));
        }
      }}
      className="grid h-9 w-9 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
