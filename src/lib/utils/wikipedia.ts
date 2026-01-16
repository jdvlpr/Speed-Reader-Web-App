/**
 * Fetches the daily featured article from Wikipedia.
 * Uses the Wikimedia Feed API: https://api.wikimedia.org/wiki/Feed_API/Reference/Featured_content
 */
export async function fetchDailyArticle(): Promise<{
  extract: string;
  title: string;
  href: string;
} | null> {
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
      return {
        extract: data.tfa.extract,
        title: data.tfa.titles.normalized,
        href: data.tfa.content_urls.desktop.page,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching Wikipedia article:", error);
    return null;
  }
}

/**
 * Fetches a random article summary from Wikipedia.
 * Uses the REST API: https://en.wikipedia.org/api/rest_v1/page/random/summary
 */
export async function fetchRandomArticle(): Promise<{
  extract: string;
  title: string;
  href: string;
} | null> {
  try {
    const url = "https://en.wikipedia.org/api/rest_v1/page/random/summary";

    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        "Failed to fetch random Wikipedia article:",
        response.statusText
      );
      return null;
    }

    const data = await response.json();

    if (
      data &&
      data.extract &&
      data.titles &&
      data.titles.normalized &&
      data.content_urls &&
      data.content_urls.desktop &&
      data.content_urls.desktop.page
    ) {
      return {
        extract: data.extract,
        title: data.titles.normalized,
        href: data.content_urls.desktop.page,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching random Wikipedia article:", error);
    return null;
  }
}
