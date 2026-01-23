import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function getDailyVisits(projectId: string, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: visits, error } = await supabase
    .from("visits")
    .select("created_at")
    .eq("project_id", projectId)
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching visits:", error);
    return [];
  }

  // Aggregate by day
  const visitsByDay: Record<string, number> = {};

  // Initialize all days with 0
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    visitsByDay[dateStr] = 0;
  }

  visits.forEach((visit) => {
    const dateStr = new Date(visit.created_at).toISOString().split("T")[0];
    if (visitsByDay[dateStr] !== undefined) {
      visitsByDay[dateStr] += 1;
    }
  });

  // Convert to array
  return Object.entries(visitsByDay)
    .map(([date, count]) => {
      const d = new Date(date);
      // Format: "Jan 23"
      const name = d.toLocaleDateString("es-ES", {
        month: "short",
        day: "numeric",
      });
      return { name, value: count, fullDate: date };
    })
    .sort(
      (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime(),
    );
}

export async function getTotalVisits(projectId: string) {
  const { count, error } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId);

  if (error) {
    console.error("Error count visits:", error);
    return 0;
  }
  return count || 0;
}
