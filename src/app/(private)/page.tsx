import CarouselContainer from "@/components/carousel-container";
import RestaurantCard from "@/components/restaurant-card";
import RestaurantList from "@/components/restaurant-list";
import Categories from "@/components/categories";
import Section from "@/components/ui/section";
import { fetchLocation, fetchRamenRestaurants, fetchRestaurants } from "@/lib/restaurants/api";

export default async function Home() {
  const {lat,lng} = await fetchLocation();

  // 緯度・経度が取得できない場合は住所登録を促す
  if (lat === undefined || lng === undefined) {
    return <p>住所を登録してください。</p>;
  }

  const { data: nearbyRestaurants, error: nearbyRestaurantsError } =
    await fetchRestaurants(lat,lng);

  const { data: nearbyRamenRestaurants, error: nearbyRamenRestaurantsError } =
    await fetchRamenRestaurants(lat,lng);

  return (
    <>
      <Categories />
      {/* レストラン情報 */}
      {!nearbyRestaurants ? (
        <p>{nearbyRestaurantsError}</p>
      ) : nearbyRestaurants.length > 0 ? (
        <Section
          title="近くのレストラン"
          expandedContent={<RestaurantList restaurants={nearbyRestaurants} />}
        >
          {/* レストランのカルーセル */}
          <CarouselContainer slideToShow={4}>
            {nearbyRestaurants.map((restaurant, index) => (
              <RestaurantCard key={index} restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くのレストランはありません</p>
      )}
      {/* ラーメン店情報 */}
      {!nearbyRamenRestaurants ? (
        <p>{nearbyRamenRestaurantsError}</p>
      ) : nearbyRamenRestaurants.length > 0 ? (
        <Section
          title="近くのラーメン店"
          expandedContent={
            <RestaurantList restaurants={nearbyRamenRestaurants} />
          }
        >
          <CarouselContainer slideToShow={4}>
            {nearbyRamenRestaurants.map((restaurant, index) => (
              <RestaurantCard key={index} restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにラーメン屋さんはありません</p>
      )}
    </>
  );
}
