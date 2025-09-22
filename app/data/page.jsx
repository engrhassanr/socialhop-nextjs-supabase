import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

async function fetchTable(table) {
  const { data, error } = await supabaseAdmin.from(table).select("*");
  if (error) {
    return { error: error.message, data: [] };
  }
  return { data };
}

export default async function DataPage() {
  const tables = ["User", "Post", "Comment", "Like", "Trend", "Follow"];

  const results = await Promise.all(tables.map((t) => fetchTable(t)));

  return (
    <main style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        Supabase Data
      </h1>
      <p style={{ marginBottom: 24 }}>Showing rows from all main tables.</p>
      <div style={{ display: "grid", gap: 16 }}>
        {tables.map((table, idx) => {
          const { data, error } = results[idx];
          return (
            <section
              key={table}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                {table} ({Array.isArray(data) ? data.length : 0})
              </h2>
              {error ? (
                <pre style={{ color: "#b91c1c", whiteSpace: "pre-wrap" }}>
                  {error}
                </pre>
              ) : (
                <pre
                  style={{
                    background: "#0b1021",
                    color: "#e5e7eb",
                    padding: 12,
                    borderRadius: 6,
                    overflow: "auto",
                  }}
                >
                  {JSON.stringify(data, null, 2)}
                </pre>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
