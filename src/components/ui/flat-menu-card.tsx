import Image from "next/image";
import { Card } from "./card";
import { Menu } from "@/types";

interface FlatMenuCardProps {
  menu: Menu;
  onClick?: (menu: Menu) => void;
}

export default function FlatMenuCard({ menu, onClick }: FlatMenuCardProps) {
  return (
    <Card className="p-0 overflow-hidden glass hover:shadow-modern-lg transition-all duration-300 hover:scale-[1.01] group cursor-pointer animate-in fade-in-0 slide-in-from-left-4 duration-500">
      <div onClick={() => onClick?.(menu)} className="flex flex-1">
        <div className="w-3/5 p-5 flex flex-col justify-center">
          <p className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-200">{menu.name}</p>
          <p className="text-muted-foreground font-medium">
            <span className="text-primary font-semibold text-lg">¥{menu.price}</span>
          </p>
          <div className="mt-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>15分</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-2/5 relative aspect-square group-hover:scale-105 transition-transform duration-500">
          <Image
            fill
            src={menu.photoUrl}
            alt={menu.name}
            className="object-cover w-full h-full"
            sizes="176px"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </Card>
  );
}
