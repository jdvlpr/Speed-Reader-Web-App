/**
 * Fetches the daily featured article from Wikipedia.
 * Uses the Wikimedia Feed API: https://api.wikimedia.org/wiki/Feed_API/Reference/Featured_content
 */
export async function fetchDailyArticle(): Promise<string | null> {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error("Failed to fetch Wikipedia article:", response.statusText);
      return null;
    }

    const data = await response.json();

    // The 'tfa' field contains "Today's Featured Article"
    if (data && data.tfa && data.tfa.extract) {
      return data.tfa.extract;
    }

    return null;
  } catch (error) {
    console.error("Error fetching Wikipedia article:", error);
    return null;
  }
}
