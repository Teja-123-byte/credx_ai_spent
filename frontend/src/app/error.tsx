"use client";

export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body className="p-10">
        <h1 className="text-2xl">Something went wrong</h1>
        <pre className="whitespace-pre-wrap">{String(error?.message || error)}</pre>
      </body>
    </html>
  );
}
