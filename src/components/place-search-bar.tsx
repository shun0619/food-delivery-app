"use client";
import React, { use, useEffect, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuidv4 } from "uuid";
import { RestaurantSuggestion } from "@/types";
import { AlertCircle, LoaderCircle, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PlaeSearchBar() {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [suggestions, setSuggestions] = useState<RestaurantSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clickedOnItem = useRef(false);
  const router = useRouter();

  const fetchSuggestions = useDebouncedCallback(async (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/restaurant/autocomplete?input=${input}&sessionToken=${sessionToken}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        return;
      }

      const data: RestaurantSuggestion[] = await response.json();

      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setErrorMessage("An error occurred while fetching suggestions.");
    } finally {
      setIsLoading(false);
    }
  }, 500);

  useEffect(() => {
    if (!inputText.trim()) {
      setOpen(false);
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    setOpen(true);
    fetchSuggestions(inputText);
  }, [inputText]);

  const handleBlur = () => {
    if (!clickedOnItem.current) {
      setOpen(false);
    }
    clickedOnItem.current = false;
  };

  const handleFocus = () => {
    if (inputText) {
      setOpen(true);
    }
  };

  const handleSelectSuggestion = (suggestion: RestaurantSuggestion) => {
    console.log("Selected suggestion:", suggestion);
    if (suggestion.type === "placePrediction") {
      router.push(
        `/restaurant/${suggestion.placeId}?sessionToken=${sessionToken}`
      );
      setSessionToken(uuidv4());
    } else {
      // 検索結果ページに移動
      router.push(`/search?restaurant=${suggestion.placeName}`);
    }
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!inputText.trim()) return;
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/search?restaurant=${inputText}`);
      setOpen(false);
    }
  };

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-muted"
      shouldFilter={false}
    >
      <CommandInput
        value={inputText}
        className=""
        placeholder="Type a command or search..."
        onValueChange={setInputText}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {open && (
        <div className="relative">
          <CommandList className="absolute bg-background w-full shadow-md rounded-lg">
            <CommandEmpty>
              <div className="flex items-center justify-center">
                {isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : errorMessage ? (
                  <div className="flex items-center text-destructive gap-2">
                    <AlertCircle />
                    {errorMessage}
                  </div>
                ) : (
                  "レストランが見つかりません"
                )}
              </div>
            </CommandEmpty>

            {suggestions.map((suggestion, index) => (
              <CommandItem
                className="p-5"
                key={suggestion.placeId ?? index}
                value={suggestion.placeName}
                onSelect={() => handleSelectSuggestion(suggestion)}
                onMouseDown={() => (clickedOnItem.current = true)}
              >
                {suggestion.type === "queryPrediction" ? (
                  <Search />
                ) : (
                  <MapPin />
                )}
                <p>{suggestion.placeName}</p>
              </CommandItem>
            ))}
          </CommandList>
        </div>
      )}
    </Command>
  );
}
