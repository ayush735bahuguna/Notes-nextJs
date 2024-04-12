"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import DarkImage from "@/asset/settings/Appearance/DarkMode.png";
import LightImage from "@/asset/settings/Appearance/LightMode.png";
import { useTheme } from "next-themes";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type themeType = {
  setTheme: Function;
  theme: string;
};
export default function Page() {
  const { setTheme, theme }: themeType = useTheme() as themeType;
  const [Mode, setMode] = useState<string>(theme);

  useEffect(() => {
    if (Mode === "light") {
      LightHandlerBtn?.current?.classList.add("outline");
      DarkHandlerBtn?.current?.classList.remove("outline");
    } else if (Mode === "dark") {
      DarkHandlerBtn?.current?.classList.add("outline");
      LightHandlerBtn?.current?.classList.remove("outline");
    }
  }, [Mode]);

  const Submithandler = () => {
    setTheme(Mode);
  };

  const router = useRouter();
  const LightHandlerBtn = useRef<HTMLDivElement>(null);
  const DarkHandlerBtn = useRef<HTMLDivElement>(null);
  return (
    <section className="p-5">
      <div className="flex items-center gap-7">
        <Button
          variant={"outline"}
          onClick={() => {
            router.push("/Home");
          }}
          className="mb-5"
        >
          {" "}
          <ArrowLeft />{" "}
        </Button>
        <span className="mb-4">
          <h1 className="text-2xl">Appearance</h1>
          <p className="text-muted-foreground">
            Customize the appearance of the app. Automatically switch between
            day and night themes.
          </p>
        </span>
      </div>

      <div className="flex gap-4 pt-4">
        <div
          onClick={() => {
            setMode("dark");
          }}
          ref={DarkHandlerBtn}
          className="p-1 rounded-xl"
        >
          <Image
            src={DarkImage}
            width={200}
            height={200}
            className="rounded-xl cursor-pointer"
            alt=""
          />
        </div>
        <div
          onClick={() => {
            setMode("light");
          }}
          ref={LightHandlerBtn}
          className="p-1 rounded-xl"
        >
          <Image
            src={LightImage}
            width={200}
            height={200}
            className="rounded-xl cursor-pointer"
            alt=""
          />
        </div>
      </div>

      <Button type="submit" className="mt-5" onClick={Submithandler}>
        Update Appearance
      </Button>
    </section>
  );
}
