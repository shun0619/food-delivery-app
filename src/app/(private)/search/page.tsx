import Categories from "@/components/categories";
import RestaurantList from "@/components/restaurant-list";
import { redirect } from "next/navigation";
import {
  fetchCategoryRestaurants,
  fetchRestaurantsByKeyword,
} from "@/lib/restaurants/api";

import React from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ category: string; restaurant: string }>;
}) {
  const { category, restaurant } = await searchParams;

  if (category) {
    const {
      data: nearbyCategoryRestaurants,
      error: nearbyCategoryRestaurantsError,
    } = await fetchCategoryRestaurants(category);
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
      await fetchRestaurantsByKeyword(restaurant);
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
