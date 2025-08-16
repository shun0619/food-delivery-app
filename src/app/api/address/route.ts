import { createClient } from "@/app/utils/supabase/server";
import { Address } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import React from "react";

export async function GET(request: NextRequest) {
  try {
    let addressList: Address[] = [];
    let selectedAddress: Address | null = null;

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "ユーザーが認証されていません" },
        { status: 401 }
      );
    }

    // 住所情報をテーブルから取得
    const { data: addressData, error: addressError } = await supabase
      .from("addresses")
      .select("id,name,address_text,latitude,longitude")
      .eq("user_id", user.id);

    if (addressError) {
      return NextResponse.json(
        { error: "住所情報の取得に失敗しました" },
        { status: 500 }
      );
    }

    addressList = addressData;

    // 選択中の住所情報をテーブルから取得
    const { data: selectedAddressData, error: selectedAddressDataError } =
      await supabase
        .from("profiles")
        .select("addresses(id,name,address_text,latitude,longitude)")
        .eq("user_id", user.id)
        .single();

    if (selectedAddressDataError) {
      return NextResponse.json(
        { error: "プロフィール情報の取得に失敗しました" },
        { status: 500 }
      );
    }

    selectedAddress = selectedAddressData.addresses;

    // console.log("addressList",addressList);
    // console.log("selectedAddress",selectedAddress);

    return NextResponse.json({addressList, selectedAddress})

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました" });
  }
}

