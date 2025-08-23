import { PlaceSearchResult, Restaurant } from "@/types";
import { getPhotoUrl } from "./api";

export async function transformPlaceResults(restaurants: PlaceSearchResult[]) {
  const promises = restaurants.map(async (restaurant):Promise<Restaurant> => ({
    id: restaurant.id,
    restaurantName: restaurant.displayName?.text,
    primaryType: restaurant.primaryType,
    //お金かかるので
    // photoUrl: restaurant.photos?.[0]?.name
    //   ? await getPhotoUrl(restaurant.photos[0].name)
    //   : "/no_image.png",
    photoUrl: "/images/no_image.png",
  }));


  const data = await Promise.all(promises);
  return data;
}
