export interface GooglePlaceSearchApiResponse {
  places?: PlaceSearchResult[];
}

export interface PlaceSearchResult {
  id: string;
  displayName?: {
    languageCode?: string;
    text?: string;
  };
  primaryType?: string;
  photos?: PlacePhoto[];
}

export interface PlacePhoto {
  name?: string;
}

export interface Restaurant {
  id: string;
  restaurantName?: string;
  primaryType?: string;
  photoUrl: string;
}

export interface GooglePlaceAutocompleteApiResponse {
  suggestions?: PlaceAutocompleteResult[];
}

export interface PlaceAutocompleteResult {
  placePrediction?: {
    place?: string;
    placeId?: string;
    structuredFormat?: {
      mainText?: {
        text?: string;
      };
      secondaryText?: {
        text?: string;
      };
    };
  };
  queryPrediction?: {
    text?: {
      text?: string;
    };
  };
}
export interface GooglePlaceDetailsApiResponse {
  location?: {
    latitude?: number;
    longitude?: number;
  };
  displayName?: {
    languageCode?: string;
    text: string;
  };
  primaryType?: string;
  photos?: PlacePhoto[];
}

export interface PlaceDetailsAll {
  location?: { latitude?: number; longitude?: number };
  displayName?: string;
  primaryType?: string;
  photoUrl?: string;
}

export interface RestaurantSuggestion {
  type: string;
  placeId?: string;
  placeName: string;
}

export interface AddressSuggestion {
  placeId: string;
  placeName: string;
  address_text: string;
}

export interface Address {
  id: number;
  name: string;
  address_text: string;
  latitude: number;
  longitude: number;
}

export interface CategoryMenu {
  categoryName: string;
  id: string;
  items: Menu[];
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  photoUrl: string;
}

export interface Cart {
  restaurantName: string | undefined;
  photoUrl: string;
  id: number;
  restaurant_id: string;
  cart_items: CartItem[];
}

export interface CartItem {
  id: number;
  quantity: number;
  menus: {
    id: number;
    name: string;
    price: number;
    photoUrl: string;
  };
}

export interface Order {
    order_items: OrderItem[];
    restaurantName: string | undefined;
    photoUrl: string;
    id: number;
    restaurant_id: string;
    created_at: string;
    fee: number;
    service: number;
    delivery: number;
    subtotal_price: number;
    total_price: number;
}

export interface OrderItem {
   photoUrl: string;
   id: number;
   price: number;
   quantity: number;
   name: string;
}

