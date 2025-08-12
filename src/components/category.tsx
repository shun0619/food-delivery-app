import React from "react";
import { CategoryType } from "./categories";
import Image from "next/image";
import { cn } from "@/lib/utils";


interface CategoryProps {
  category: CategoryType;
  onClick: (type: string) => void;
  select: boolean;
}
export default function Category({ category, onClick, select }: CategoryProps) {
  return (
    <>
      <div onClick={() => onClick(category.type)}>
          <div className={cn("relative aspect-square rounded-full overflow-hidde scale-75", select && "bg-green-200")}>
            <Image
              className="object-cover"
              src={category.imageUrl}
              fill
              alt={category.categoryName}
            sizes="(max-width: 1280px) 10vw, 97px"
            />
          </div>
          <div className="text-center mt-2">
            <p className="truncate text-xs">{category.categoryName}</p>
          </div>
      </div>
    </>
  );
}
