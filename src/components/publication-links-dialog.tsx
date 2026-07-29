"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, X } from "lucide-react";
import type { PeerReviewedPaper } from "@/data/peer-reviewed-papers";

interface PublicationLinksDialogProps {
  paper: PeerReviewedPaper | null;
  onClose: () => void;
}

export function PublicationLinksDialog({ paper, onClose }: PublicationLinksDialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!paper) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("hidden"));

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [paper, onClose]);

  if (!paper) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex bg-[#0b1326]/72 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full flex-col overflow-hidden bg-[#fffdf8] shadow-2xl sm:h-auto sm:max-h-[min(720px,calc(100vh-3rem))] sm:max-w-2xl sm:rounded-[2rem]"
      >
        <header className="flex items-center justify-between gap-6 border-b border-[#14213d]/12 px-5 py-5 sm:px-8 sm:py-6">
          <h2 id={titleId} className="text-3xl leading-tight tracking-[-0.03em] sm:text-4xl">
            Choose a publication link
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close publication links"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-[#14213d]/14 bg-white text-[#14213d] transition-colors hover:border-[#147d79]/45 hover:text-[#147d79] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-7 sm:px-8 sm:py-9">
          <ul className="grid gap-3">
            {paper.publicationLinks.map((link, index) => (
              <li key={link.url}>
                <a
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onClose}
                  className="flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-[#14213d]/14 bg-white px-5 py-4 text-base font-bold text-[#14213d] transition-colors hover:border-[#147d79]/50 hover:text-[#147d79] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147d79]"
                >
                  <span>{link.label}</span>
                  <ExternalLink aria-hidden="true" className="size-5 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}
