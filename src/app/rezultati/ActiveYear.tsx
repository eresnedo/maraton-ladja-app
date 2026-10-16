"use client";

import { useEffect } from "react";

// na mobitelu traka godina sama dođe do odabrane godine
export default function ActiveYear() {
  useEffect(() => {
    const a = document.querySelector<HTMLElement>(".r-years a.on");
    const ul = a?.closest("ul");
    if (a && ul && ul.scrollWidth > ul.clientWidth) ul.scrollLeft = a.offsetLeft - ul.clientWidth / 2 + a.offsetWidth / 2;
  }, []);
  return null;
}
