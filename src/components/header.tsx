import Link from "next/link";
import React from "react";
import MenuSheet from "./menu-sheet";

function Header() {
  return (
    <header className="bg-background h-16 fixed top-0 left-0 w-full">
      <div className="flex items-center h-full space-x-4 px-4 max-w-[1920px] mx-auto">
        <MenuSheet/>
        <div className="font-bold">
          <Link href={"/"}>Delivery APP</Link>
        </div>
        <div className="flex-1 bg-yellow-200">住所を選択</div>
        <div>検索バー</div>
        <div>カート</div>
      </div>
    </header>
  );
}

export default Header;
