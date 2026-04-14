import { Country } from "../types";

const BASE_URL = "/api/countries";

// The API now requires specifying fields (up to 10) for the /all endpoint
const LIST_FIELDS = [
  "name",
  "flags",
  "population",
  "region",
  "subregion",
  "capital",
  "cca3",
  "languages",
  "currencies",
  "borders"
].join(",");

async function fetchWithRetry(url: string, retries = 3, backoff = 1000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (response.ok) return response;
      
      // If it's a 404, don't retry
      if (response.status === 404) return response;
      
    } catch (err) {
      if (i === retries - 1) throw err;
    }
    await new Promise(resolve => setTimeout(resolve, backoff * (i + 1)));
  }
  return fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  }); // Final attempt
}

export async function getAllCountries(): Promise<Country[]> {
  try {
    const response = await fetchWithRetry(`${BASE_URL}?fields=${LIST_FIELDS}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("API Error (getAllCountries):", error);
    throw error;
  }
}

export async function getCountryByCode(code: string): Promise<Country> {
  try {
    // For a single country, we want all fields for the detail view
    const response = await fetchWithRetry(`${BASE_URL}/${code}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch country with code ${code}: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error(`API Error (getCountryByCode ${code}):`, error);
    throw error;
  }
}

export async function getCountriesByCodes(codes: string[]): Promise<Country[]> {
  if (codes.length === 0) return [];
  try {
    // For border countries, we need name, cca3, and flags for a smooth transition
    const response = await fetchWithRetry(`${BASE_URL}/alpha?codes=${codes.join(",")}&fields=name,cca3,flags`);
    if (!response.ok) {
      throw new Error(`Failed to fetch bordering countries: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("API Error (getCountriesByCodes):", error);
    throw error;
  }
}
