import type { Metadata } from "next";
import CharacterSelectWrapper from "@/components/character-select/CharacterSelectWrapper";

export const metadata: Metadata = {
  title: "Character Select — World Cup 2026",
  description: "Choose your fighter.",
};

export default function CharacterSelectPage() {
  return <CharacterSelectWrapper />;
}
