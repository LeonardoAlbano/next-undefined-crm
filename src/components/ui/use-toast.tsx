/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastContextType {
  toast: (props: ToastProps) => void;
}

const toastContext: ToastContextType = {
  toast: () => {},
};

export function toast({ title, description, variant = "default" }: ToastProps) {
  // Implementação simples de toast
  const toastElement = document.createElement("div");
  toastElement.className = `fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 rounded-lg border p-4 shadow-lg ${
    variant === "destructive"
      ? "border-red-600 bg-red-950 text-red-50"
      : "border-zinc-800 bg-zinc-950 text-zinc-50"
  }`;

  const toastHeader = document.createElement("div");
  toastHeader.className = "flex justify-between";

  const titleElement = document.createElement("div");
  titleElement.className = "font-semibold";
  titleElement.textContent = title;

  const closeButton = document.createElement("button");
  closeButton.className = "rounded-full p-1 hover:bg-zinc-800";
  closeButton.innerHTML =
    // eslint-disable-next-line quotes
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
  closeButton.onclick = () => document.body.removeChild(toastElement);

  toastHeader.appendChild(titleElement);
  toastHeader.appendChild(closeButton);
  toastElement.appendChild(toastHeader);

  if (description) {
    const descriptionElement = document.createElement("div");
    descriptionElement.className = "text-sm opacity-90";
    descriptionElement.textContent = description;
    toastElement.appendChild(descriptionElement);
  }

  document.body.appendChild(toastElement);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(toastElement)) {
      document.body.removeChild(toastElement);
    }
  }, 5000);
}
