"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDebouncedCallback } from "use-debounce";
import { Address, AddressSuggestion } from "@/types";
import { AlertCircle, LoaderCircle, MapPin, Trash2 } from "lucide-react";
import {
  selectSuggestionAction,
  selectAddressAction,
  deleteAddressAction,
} from "@/app/(private)/actions/address-actions";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface AddressResponse {
  addressList: Address[];
  selectedAddress: Address;
}

export default function AddressModal() {
  const [inputText, setInputText] = useState("");
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const fetchSuggestions = useDebouncedCallback(async (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/address/autocomplete?input=${input}&sessionToken=${sessionToken}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        return;
      }

      const data: AddressSuggestion[] = await response.json();

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
      setSuggestions([]);
      return;
    }
    setIsLoading(true);

    fetchSuggestions(inputText);
  }, [inputText]);

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data;
  };

  const {
    data,
    error,
    isLoading: loading,
    mutate,
  } = useSWR<AddressResponse>(`/api/address`, fetcher);

  // console.log("swr_data", data);

  if (error) {
    console.error(error);
    return <div>{error.message}</div>;
  }
  if (loading) return <div>loading...</div>;

  const handleSelectSuggestion = async (suggestion: AddressSuggestion) => {
    // serverActions呼び出し
    try {
      await selectSuggestionAction(suggestion, sessionToken);
      setSessionToken(uuidv4());
      setInputText("");
      mutate();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("予期せぬエラーが発生しました");
    }
  };

  const handleSelectAddress = async (address: Address) => {
    try {
      await selectAddressAction(address.id);
      mutate();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("予期せぬエラーが発生しました");
    }
  };

  const handleDeleteAddress = async (address: Address) => {
    const ok = window.confirm("この住所を削除しますか？");
    if (!ok) return;
    try {
      const selectedAddressId = data?.selectedAddress.id;
      await deleteAddressAction(address.id);
      mutate();
      if (selectedAddressId === address.id) {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("予期せぬエラーが発生しました");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DialogTrigger>
          {data?.selectedAddress ? data.selectedAddress.name : "住所を選択"}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>住所</DialogTitle>
            <DialogDescription className="sr-only">
              住所登録と選択
            </DialogDescription>
          </DialogHeader>

          <Command shouldFilter={false}>
            <div className="bg-muted mb-4">
              <CommandInput
                value={inputText}
                onValueChange={setInputText}
                placeholder="Type a command or search..."
              />
            </div>

            <CommandList>
              {inputText ? (
                <>
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
                        "住所が見つかりません"
                      )}
                    </div>
                  </CommandEmpty>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      onSelect={() => handleSelectSuggestion(suggestion)}
                      key={suggestion.placeId}
                      className="p-5"
                    >
                      <MapPin />
                      <div>
                        <p className="font-bold">{suggestion.placeName}</p>
                        <p className="text-muted-foreground">
                          {suggestion.address_text}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </>
              ) : (
                // 登録済みの住所を表示
                <>
                  <h3 className="font-bold text-lg mb-2">保存済みの住所</h3>
                  {data?.addressList.map((address) => (
                    <CommandItem
                      onSelect={() => handleSelectAddress(address)}
                      key={address.id}
                      className={cn(
                        "p-5 justify-between items-center",
                        address.id === data?.selectedAddress?.id && "bg-muted"
                      )}
                    >
                      <div>
                        <p className="font-bold">{address.name}</p>
                        <p>{address.address_text}</p>
                      </div>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address);
                        }}
                        size={"icon"}
                        variant={"ghost"}
                      >
                        <Trash2 />
                      </Button>
                    </CommandItem>
                  ))}
                </>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
