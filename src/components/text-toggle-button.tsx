"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";

export default function TextToggleButton() {
  const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

  return <Button onClick={toggleExpand}>{isExpanded ? "表示を戻す" : "すべて表示"}</Button>;
}
