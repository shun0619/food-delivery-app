import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bookmark, Heart, Menu } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/(auth)/login/actions";

export default async function MenuSheet() {

const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
    redirect("/login");
}

const { avatar_url, full_name } = user.user_metadata
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-6">
        <SheetHeader className="sr-only">
          <SheetTitle>メニュー情報</SheetTitle>
          <SheetDescription>ユーザ情報とメニュー情報を表示</SheetDescription>
        </SheetHeader>

        {/* ユーザ情報エリア */}
        <div className="flex item-center gap-5">
          <div className="font-bold">
            <Avatar>
              <AvatarImage src={ avatar_url } />
              <AvatarFallback>ユーザー名</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div>{ full_name }</div>
            <div>
              <Link href={"#"} className="text-green-500 text-xs">
                アカウントを管理する
              </Link>
            </div>
          </div>
        </div>

        {/* メニューエリア */}
        <ul className="space-y-4">
          <li>
            <Link href={"orders"} className="flex items-center gap-4" >
              <Bookmark fill="bg-primary" />
              <span className="font-bold">ご注文内容</span>
            </Link>
          </li>
          <li>
            <Link href={"favorites"} className="flex items-center gap-4">
              <Heart fill="bg-primary" />
              <span className="font-bold">お気に入り</span>
            </Link>
          </li>
        </ul>
        <SheetFooter>
            <form >
                <Button  className="w-full" formAction={ logout }>ログアウト</Button>
            </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

