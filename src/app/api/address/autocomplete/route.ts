import {
    AddressSuggestion,
  GooglePlaceAutocompleteApiResponse,
  RestaurantSuggestion,
} from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get("input");
  const sessionToken = searchParams.get("sessionToken");

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
      //   includeQueryPredictions: true,
      sessionToken: sessionToken,
      input: input,
      //   includedPrimaryTypes: ["restaurant"],
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
      headers: header,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData);
      return NextResponse.json(
        {
          error: `Autocomplete request failed: ${response.status}`,
        },
        { status: 500 }
      );
    }

    const data: GooglePlaceAutocompleteApiResponse = await response.json();
    // console.log("Autocomplete Data:", JSON.stringify(data, null, 2));

    const suggestions = data.suggestions ?? [];

    const results = suggestions.map((suggestion) => {
        return {
            placeId: suggestion.placePrediction?.placeId,
            placeName: suggestion.placePrediction?.structuredFormat?.mainText?.text,
            address_text: suggestion.placePrediction?.structuredFormat?.secondaryText?.text
        }
    }).filter(
        (suggestion): suggestion is AddressSuggestion =>
          !!suggestion.placeId &&
        !!suggestion.placeName &&
        !!suggestion.address_text
      );
    //   console.log("suggestion", results);

    
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in autocomplete route:", error);
  return NextResponse.json({ error: "サーバー内部でエラーが発生しました" });
  }
}
