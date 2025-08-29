import { Menu } from "@/types";
import Image from "next/image";

interface MenuCardProps {
  menu: Menu;
  onClick?: (menu: Menu) => void;
}

export default function MenuCard({ menu, onClick }: MenuCardProps) {
  return (
    <div 
      onClick={() => onClick?.(menu)} 
      className="cursor-pointer group animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-modern hover:shadow-modern-lg transition-all duration-300 group-hover:scale-[1.02]">
        <Image
          src={menu.photoUrl}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          alt={menu.name}
          fill
          sizes="(max-width: 1280px) 18.75vw, 240px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="glass rounded-lg p-3">
            <p className="text-white font-semibold text-sm truncate">{menu.name}</p>
            <p className="text-white/80 text-xs">￥{menu.price}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 px-1">
        <p className="font-bold truncate text-foreground group-hover:text-primary transition-colors duration-200">{menu.name}</p>
        <p className="text-muted-foreground">
          <span className="text-sm font-medium">￥{menu.price}</span>
        </p>
      </div>
    </div>
  );
}
