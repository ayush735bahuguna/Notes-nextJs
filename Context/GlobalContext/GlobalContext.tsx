"use client";
import { createContext, useContext, useEffect, useState } from "react";
const GlobalContext = createContext<any>({
  GridLayout: true,
  selectedNote: {
    id: "",
    title: "",
    content: "",
    pinned: false,
  },
  setGridLayout: () => {},
  setSelectedNote: () => {},
});

type noteType = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
};

export default function GlobalContextProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [GridLayout, setGridLayout] = useState<boolean>(true);
  const [selectedNote, setSelectedNote] = useState<noteType>({
    id: "",
    title: "",
    content: "",
    pinned: false,
  });

  const value = {
    GridLayout,
    setGridLayout,
    selectedNote,
    setSelectedNote,
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);
