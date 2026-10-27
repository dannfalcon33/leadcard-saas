export async function getDailyVisits(projectId: string, days = 7) {
  try {
    const res = await fetch(`/api/analytics/visits?projectId=${encodeURIComponent(projectId)}&days=${days}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch visits: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching daily visits:", error);
    return [];
  }
}
