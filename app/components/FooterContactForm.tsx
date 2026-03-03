"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function FooterContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append(
      "access_key",
      process.env.NEXT_PUBLIC_FORM_ACCESS_KEY ?? ""
    );

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setErrorMsg(data.message ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-2xl shadow-lg">
          🎉
        </div>
        <p className="text-lg font-semibold text-zinc-900">Message sent!</p>
        <p className="text-sm text-zinc-500">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-10 flex w-full flex-col gap-3"
    >
      <div className="flex gap-3">
        <input
          type="text"
          name="name"
          required
          placeholder="Your name"
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
        />
      </div>

      <textarea
        name="message"
        required
        rows={4}
        placeholder="Tell me about your project..."
        className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
      />

      {status === "error" && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-md transition-all hover:from-yellow-400 hover:to-orange-400 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
