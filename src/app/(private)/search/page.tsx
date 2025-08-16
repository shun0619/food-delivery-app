import Categories from "@/components/categories";
import RestaurantList from "@/components/restaurant-list";
import { redirect } from "next/navigation";
import {
  fetchCategoryRestaurants,
  fetchLocation,
  fetchRestaurantsByKeyword,
} from "@/lib/restaurants/api";

import React from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ category: string; restaurant: string }>;
}) {
  const { category, restaurant } = await searchParams;
  const {lat,lng} = await fetchLocation();

  // 緯度・経度が取得できない場合は住所登録を促す
  if (lat === undefined || lng === undefined) {
    return <p>住所を登録してください。</p>;
  }

  if (category) {
    const {
      data: nearbyCategoryRestaurants,
      error: nearbyCategoryRestaurantsError,
    } = await fetchCategoryRestaurants(category,lat,lng);
    return (
      <>
        <div className="mb-4">
          <Categories />
        </div>

        {!nearbyCategoryRestaurants ? (
          <p className="text-destructive">{nearbyCategoryRestaurantsError}</p>
        ) : nearbyCategoryRestaurants.length > 0 ? (
          <RestaurantList restaurants={nearbyCategoryRestaurants} />
        ) : (
          <p>
            カテゴリ<strong>{category}</strong>
            に一致するレストランが見つかりません
          </p>
        )}
      </>
    );
  } else if (restaurant) {
    const { data: textSearchRestaurants, error: textSearchRestaurantsError } =
      await fetchRestaurantsByKeyword(restaurant,lat,lng);
    return (
      <>
        {!textSearchRestaurants ? (
          <p className="text-destructive">{textSearchRestaurantsError}</p>
        ) : textSearchRestaurants.length > 0 ? (
          <>
            <div className="mb-4">
              {restaurant}の検索結果{RestaurantList.length}件の結果
            </div>
            <RestaurantList restaurants={textSearchRestaurants} />
          </>
        ) : (
          <p>
            <strong>{restaurant}</strong>
            に一致するレストランが見つかりません
          </p>
        )}
      </>
    );
  } else {
    redirect("/");
  }
}
