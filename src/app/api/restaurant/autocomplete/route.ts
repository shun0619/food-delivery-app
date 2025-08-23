import {
  GooglePlaceAutocompleteApiResponse,
  RestaurantSuggestion,
} from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get("input");
  const sessionToken = searchParams.get("sessionToken");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  // console.log("Input:", input);
  // console.log("Session Token:", sessionToken);

  if (!input) {
    return NextResponse.json({ error: "入力が必要です" }, { status: 400 });
  }

  if (!sessionToken) {
    return NextResponse.json(
      { error: "セッショントークンが必要です" },
      { status: 400 }
    );
  }

  try {
    const url = "https://places.googleapis.com/v1/places:autocomplete";
    const apiKey = process.env.GOOGLE_API_KEY;

    const header = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey!,
    };

    const requestBody = {
      includeQueryPredictions: true,
      sessionToken: sessionToken,
      input: input,
      includedPrimaryTypes: ["restaurant"],
      locationBias: {
        circle: {
          center: {
            latitude: lat,
            longitude: lng,
          },
          radius: 1000.0,
        },
      },
      languageCode: "ja",
    };

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: header,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData);
      return NextResponse.json(
        {
          error: `予期せぬエラーが発生しました。: ${response.status}`,
        },
        { status: 500 }
      );
    }

    const data: GooglePlaceAutocompleteApiResponse = await response.json();
    // console.log("Autocomplete Data:", JSON.stringify(data, null, 2));

    const suggestions = data.suggestions ?? [];

    //console.log("Suggestions:", suggestions);

    const results = suggestions
      .map((suggestion) => {
        if (
          suggestion.placePrediction &&
          suggestion.placePrediction.placeId &&
          suggestion.placePrediction.structuredFormat?.mainText?.text
        ) {
          return {
            type: "placePrediction",
            placeId: suggestion.placePrediction.placeId,
            placeName:
              suggestion.placePrediction.structuredFormat?.mainText?.text,
          };
        } else if (
          suggestion.queryPrediction &&
          suggestion.queryPrediction.text?.text
        ) {
          return {
            type: "queryPrediction",
            placeName: suggestion.queryPrediction.text?.text,
          };
        }
        return undefined;
      })
      .filter((suggestion): suggestion is RestaurantSuggestion => !!suggestion);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in autocomplete route:", error);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました。" },
      { status: 500 }
    );
  }
}
