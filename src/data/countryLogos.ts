export interface CountryLogo {
  id: string;
  name: string;
  logo: string;
  /** Vertical nudge for asymmetry (px) */
  yOffset: number;
}

export const countryLogos: CountryLogo[] = [
  { id: "england", name: "ENGLAND", logo: "/country_logo/england.svg", yOffset: 6 },
  { id: "argentina", name: "ARGENTINA", logo: "/country_logo/argentina.svg", yOffset: -10 },
  { id: "spain", name: "SPAIN", logo: "/country_logo/spain.svg", yOffset: 4 },
  { id: "portugal", name: "PORTUGAL", logo: "/country_logo/portugal.svg", yOffset: -6 },
  { id: "belgium", name: "BELGIUM", logo: "/country_logo/belgium.svg", yOffset: 8 },
  { id: "norway", name: "NORWAY", logo: "/country_logo/norway.svg", yOffset: -4 },
  { id: "korea", name: "KOREA", logo: "/country_logo/korea.svg", yOffset: 2 },
];
