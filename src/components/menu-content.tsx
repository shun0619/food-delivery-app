"use client";

import React, { useState } from "react";
import CategorySidebar from "./category-sidebar";
import { CategoryMenu } from "@/types";
import Section from "./ui/section";
import CarouselContainer from "./carousel-container";
import MenuCard from "./menu-card";
import FlatMenuCard from "./ui/flat-menu-card";
import { InView } from "react-intersection-observer";

interface MenuContentProps {
  categoryMenus: CategoryMenu[];
}

export default function MenuContent({ categoryMenus }: MenuContentProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(categoryMenus[0].id);

  const handleSelectCategory = (categoryId: string) => {
    const element = document.getElementById(`${categoryId}-menu`);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex gap-4">
      <CategorySidebar
        onSelectCategory={handleSelectCategory}
        categoryMenus={categoryMenus}
        activeCategoryId={activeCategoryId}
      />
      <div className="w-3/4">
        {categoryMenus.map((category) => (
          <InView
            key={category.id}
            id={`${category.id}-menu`}
            className="scroll-mt-16"
            as="div"
            threshold={0.7}
            onChange={(inView, entry) => inView && setActiveCategoryId(category.id)}
          >
            <Section title={category.categoryName}>
              {category.id === "featured" ? (
                <CarouselContainer slideToShow={4}>
                  {category.items.map((menu) => (
                    <MenuCard key={menu.id} menu={menu} />
                  ))}
                </CarouselContainer>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {category.items.map((menu) => (
                    <FlatMenuCard key={menu.id} menu={menu} />
                  ))}
                </div>
              )}
            </Section>
          </InView>
        ))}
      </div>
    </div>
  );
}
