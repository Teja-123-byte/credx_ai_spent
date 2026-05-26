"use client";

export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body style={{ padding: 40 }}>
        <h1 style={{ fontSize: 24 }}>Something went wrong</h1>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error?.message || error)}</pre>
      </body>
    </html>
  );
}
