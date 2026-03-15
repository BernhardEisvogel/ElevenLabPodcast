"use client";

import { useState } from "react";

import { siteConfig } from "@/lib/site";

const INITIAL_FORM = {
  name: "",
  email: "",
  company: "",
  useCase: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setIsSuccess(false);
    setIsPending(true);

    try {
      const response = await fetch(siteConfig.formspreeAction, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("The message could not be sent. Please try again.");
      }

      setIsSuccess(true);
      setFeedback("Thanks. Your message has been sent.");
      setForm(INITIAL_FORM);
    } catch (error) {
      setIsSuccess(false);
      setFeedback(
        error instanceof Error ? error.message : "The message could not be sent. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="label-mono text-[10px] text-[var(--muted)]">Name</span>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="mt-2 h-[52px] w-full rounded-2xl border border-slate-900/10 bg-white/85 px-4 text-sm text-slate-900 outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <label className="block">
          <span className="label-mono text-[10px] text-[var(--muted)]">Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="mt-2 h-[52px] w-full rounded-2xl border border-slate-900/10 bg-white/85 px-4 text-sm text-slate-900 outline-none transition focus:border-[var(--accent)]"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="label-mono text-[10px] text-[var(--muted)]">Company</span>
          <input
            value={form.company}
            onChange={(event) =>
              setForm((current) => ({ ...current, company: event.target.value }))
            }
            className="mt-2 h-[52px] w-full rounded-2xl border border-slate-900/10 bg-white/85 px-4 text-sm text-slate-900 outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <label className="block">
          <span className="label-mono text-[10px] text-[var(--muted)]">Use case</span>
          <input
            value={form.useCase}
            onChange={(event) =>
              setForm((current) => ({ ...current, useCase: event.target.value }))
            }
            placeholder="Product marketing, voice agents, onboarding, audio explainers"
            className="mt-2 h-[52px] w-full rounded-2xl border border-slate-900/10 bg-white/85 px-4 text-sm text-slate-900 outline-none transition focus:border-[var(--accent)]"
          />
        </label>
      </div>

      <label className="block">
        <span className="label-mono text-[10px] text-[var(--muted)]">Message</span>
        <textarea
          required
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
          className="mt-2 min-h-40 w-full rounded-[1.6rem] border border-slate-900/10 bg-white/85 px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-[var(--accent)]"
          placeholder="Tell us what you want to build with grounded voice."
        />
      </label>

      {feedback ? (
        <div
          className={`rounded-[1.4rem] px-4 py-4 text-sm ${
            isSuccess
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-[rgba(255,122,48,0.55)]"
      >
        {isPending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
