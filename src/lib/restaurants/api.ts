import { GooglePlaceSearchApiResponse } from "@/types";
import { error } from "console";
import { transformPlaceResults } from "./utils";

// 近くのお店を取得
export async function fetchRestaurants() {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.photos",
  };

  const desiredTypes = [
    "japanese_restaurant",
    "ramen_restaurant",
    "cafe",
    "cafeteria",
    "chinese_restaurant",
    "fast_food_restaurant",
    "hamburger_restaurant",
    "french_restaurant",
    "italian_restaurant",
    "pizza_restaurant",
    "ramen_restaurant",
    "sushi_restaurant",
    "korean_restaurant",
    "indian_restaurant",
  ];

  const requestBody = {
    includedTypes: desiredTypes,
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: 35.6812855,
          longitude: 139.447112,
        },
        radius: 1000.0,
      },
    },
    languageCode: "ja",
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: headers,
    next: { revalidate: 86400 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return { error: `Error fetching ramen restaurants: ${response.status}` };
  }

  const data: GooglePlaceSearchApiResponse = await response.json();

  if (!data.places) {
    return { data: [] };
  }

  const nearbyPlaces = data.places;

  const matchingPlaces = nearbyPlaces.filter((place) => place.primaryType && desiredTypes.includes(place.primaryType));

  const Restaurants = await transformPlaceResults(matchingPlaces);

  return { data: Restaurants };
}

// 近くのラーメン店を取得
export async function fetchRamenRestaurants() {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.photos",
  };

  const requestBody = {
    includedPrimaryTypes: ["ramen_restaurant"],
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: 35.6812855,
          longitude: 139.447112,
        },
        radius: 1000.0,
      },
    },
    languageCode: "ja",
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: headers,
    next: { revalidate: 86400 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return { error: `Error fetching ramen restaurants: ${response.status}` };
  }

  const data: GooglePlaceSearchApiResponse = await response.json();
  // console.log(data);

  if (!data.places) {
    return { data: [] };
  }

  const nearbyRamenPlaces = data.places;

  const RamenRestaurants = await transformPlaceResults(nearbyRamenPlaces);

  return { data: RamenRestaurants };
}

// 検索対象のレストランを取得
export async function fetchCategoryRestaurants(category: string) {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.photos",
  };

  const requestBody = {
    includedPrimaryTypes: [category],
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: 35.6812855,
          longitude: 139.447112,
        },
        radius: 1000.0,
      },
    },
    languageCode: "ja",
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: headers,
    next: { revalidate: 86400 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return { error: `Error fetching nearby restaurants: ${response.status}` };
  }

  const data: GooglePlaceSearchApiResponse = await response.json();
  // console.log(data);

  if (!data.places) {
    return { data: [] };
  }

  const categoryPlaces = data.places;

  const categoryRestaurants = await transformPlaceResults(categoryPlaces);

  return { data: categoryRestaurants };
}


// 検索キーワードに一致するレストランを取得
export async function fetchRestaurantsByKeyword(query: string) {
  const url = "https://places.googleapis.com/v1/places:searchText";

  const apiKey = process.env.GOOGLE_API_KEY;

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.photos",
  };

  const requestBody = {
    textQuery: query,
    pageSize: 10,
    locationBias: {
      circle: {
        center: {
          latitude: 35.6812855,
          longitude: 139.447112,
        },
        radius: 1000.0,
      },
    },
    languageCode: "ja",
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: headers,
    next: { revalidate: 86400 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return { error: `TextSearch request is failed: ${response.status}` };
  }

  const data: GooglePlaceSearchApiResponse = await response.json();
  // console.log(data);

  if (!data.places) {
    return { data: [] };
  }

  const textSearchPlaces = data.places;

  const textSearchRestaurants = await transformPlaceResults(textSearchPlaces);

  return { data: textSearchRestaurants };
}


export async function getPhotoUrl(name: string, maxWidth = 400) {
  "use cache";
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`;
  return url;
}
