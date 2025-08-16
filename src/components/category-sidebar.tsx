"use client";

import { cn } from "@/lib/utils";
import { CategoryMenu } from "@/types";
import React from "react";

interface CategorySidebartProps {
  categoryMenus: CategoryMenu[];
  onSelectCategory: (categoryId: string) => void;
  activeCategoryId: string;
}

export default function CategorySidebar({
  categoryMenus,
  onSelectCategory,
  activeCategoryId,
}: CategorySidebartProps) {
  return (
    <>
      <aside className="w-1/4 sticky top-16 h-[calc(100vh-64px)]">
        <p>メニュー Menu</p>
        <nav>
          <ul>
            {categoryMenus.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className={cn(
                    "w-full p-4 text-left border-l-4 transition-colors",
                    activeCategoryId === category.id ? "bg-input font-medium border-primary" : "border-transparent hover:bg-muted"
                  )}
                  type="button"
                >
                  {category.categoryName}{" "}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
