import MenuContent from "@/components/menu-content";
import MenuSearchBar from "@/components/menu-search-bar";
import { Button } from "@/components/ui/button";
import { fetchCategoryMenus } from "@/lib/menus/api";
import { getPlaceDetails } from "@/lib/restaurants/api";
import { Heart } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function RestaurantPage({
  params,
  searchParams,
}: {
  params: Promise<{ restaurantId: string }>;
  searchParams: Promise<{ sessionToken: string; searchMenu: string }>;
}) {
  const { restaurantId } = await params;
  const { sessionToken, searchMenu } = await searchParams;

  const { data: restaurant, error } = await getPlaceDetails(
    restaurantId,
    ["displayName", "photos", "primaryType"],
    sessionToken
  );

  const primaryType = restaurant?.primaryType;

  const { data: categoryMenus, error: menusError } = primaryType
    ? await fetchCategoryMenus(primaryType, searchMenu)
    : { data: [] };

  // console.log("data", categoryMenus);

  if (error) notFound();
  return (
    <>
      <div className="animate-in fade-in-0 slide-in-from-top-4 duration-700">
        <div className="h-80 rounded-2xl shadow-modern-xl relative overflow-hidden group">
          <Image
            src={restaurant?.photoUrl ?? "/no_image.png"}
            fill
            alt={restaurant?.displayName ?? "レストラン画像"}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Button
            size="icon"
            variant="outline"
            className="absolute top-6 right-6 glass shadow-modern hover:shadow-modern-lg rounded-full transition-all duration-300 hover:scale-110 group"
          >
            <Heart className="text-red-500 transition-all duration-300 group-hover:fill-current group-hover:scale-110" strokeWidth={2} size={18} />
          </Button>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="glass rounded-xl p-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              <h2 className="text-white font-bold text-lg mb-1">{restaurant?.displayName}</h2>
              <p className="text-white/80 text-sm">美味しい料理をお楽しみください</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between animate-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
              {restaurant?.displayName}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>営業中</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>30-45分</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.8 (120+)</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 ml-8">
            <div className="w-80">
              <MenuSearchBar />
            </div>
          </div>
        </div>
      </div>

      {!categoryMenus ? (
        <p>{menusError}</p>
      ) : categoryMenus.length > 0 ? (
        <MenuContent categoryMenus={categoryMenus} restaurantId={restaurantId}/>
      ) : (
        <p>メニューが見つかりません</p>
      )}
    </>
  );
}
