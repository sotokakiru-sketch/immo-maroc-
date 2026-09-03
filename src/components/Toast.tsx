"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info";

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

// ─── Contexte ────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast doit être utilisé à l'intérieur d'un ToastProvider");
  }
  return ctx;
}

// ─── Icônes ──────────────────────────────────────────────────────────────────

const ICONS: Record<ToastType, (className?: string) => ReactNode> = {
  success: (cn) => <CheckCircle2 className={cn} />,
  error: (cn) => <AlertCircle className={cn} />,
  info: (cn) => <Info className={cn} />,
};

const STYLES: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: {
    bg: "bg-brand-50",
    border: "border-brand-200",
    icon: "text-brand-600",
    text: "text-brand-800",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-500",
    text: "text-red-700",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-500",
    text: "text-blue-700",
  },
};

// ─── Provider ────────────────────────────────────────────────────────────────

let _counter = 0;
function nextId(): string {
  _counter += 1;
  return `toast-${_counter}-${Date.now()}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = nextId();
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ─── Item toast individuel ───────────────────────────────────────────────────

function ToastItem({
  data,
  onDismiss,
}: {
  data: ToastData;
  onDismiss: (id: string) => void;
}) {
  const style = STYLES[data.type];
  const [phase, setPhase] = useState<"entering" | "visible" | "exiting">("entering");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref stable pour onDismiss — permet d'éviter de remettre le timer dans les
  // dépendances du useEffect auto-dismiss quand le parent passe une nouvelle
  // référence de fonction (p. ex. quand un autre toast est ajouté).
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  // Déclenche l'animation d'entrée au prochain frame.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("visible"));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // handleDismiss ne dépend que de data.id (stable) via la ref.
  const handleDismiss = useCallback(() => {
    setPhase("exiting");
    setTimeout(() => onDismissRef.current(data.id), 300);
  }, [data.id]);

  // Auto-dismiss : dépend uniquement de data.duration + data.id (stables).
  useEffect(() => {
    timerRef.current = setTimeout(handleDismiss, data.duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data.duration, data.id, handleDismiss]);

  const motion =
    phase === "entering"
      ? "translate-x-full opacity-0 scale-95"
      : phase === "exiting"
        ? "translate-x-full opacity-0 scale-95"
        : "translate-x-0 opacity-100 scale-100";

  return (
    <div
      role="alert"
      className={`
        pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-luxe
        backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${style.bg} ${style.border}
        ${motion}
      `}
    >
      {ICONS[data.type](`mt-0.5 h-5 w-5 shrink-0 ${style.icon}`)}
      <p className={`flex-1 text-sm font-medium leading-snug ${style.text}`}>{data.message}</p>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Fermer la notification"
        className={`shrink-0 rounded-lg p-1 transition-colors hover:bg-black/5 ${style.text}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Conteneur flottant ──────────────────────────────────────────────────────

function ToastContainer({
  toasts,
  dismiss,
}: {
  toasts: ToastData[];
  dismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 top-4 z-[999] flex flex-col items-center gap-3 sm:right-4 sm:left-auto sm:w-96"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} data={t} onDismiss={dismiss} />
      ))}
    </div>
  );
}
