import type { Metadata } from "next";
import CharacterSelectScreen from "@/components/character-select/CharacterSelectScreen";

export const metadata: Metadata = {
  title: "Character Select — World Cup 2026",
  description: "Choose your fighter.",
};

export default function CharacterSelectPage() {
  return <CharacterSelectScreen />;
}
