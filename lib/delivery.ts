export const DELIVERY_ZONES = [
  {
    name: "Proximité de Mimboman",
    fee: 1500,
    neighborhoods: ["Essos","Essomba","Mvog-Ada","Elig-Edzoa","Nkolndongo","Ngousso","Nkondengui (Kondengui)","Ekounou","Nkoabang","Biteng","Anguissa","Emombo 1er","Emombo 2e"],
  },
  {
    name: "Zone éloignée",
    fee: 2000,
    neighborhoods: ["Bastos","Tsinga","Mokolo","Messa","Briqueterie","Nlongkak","Etoudi","Emana","Nkol-Eton","Ngoa-Ekelle","Melen","Obili","Mvog-Mbi","Mvolyé","Efoulan","Nsimeyong","Biyem-Assi","Mendong","Simbock","Nkolbisson","Mvan","Ahala","Etam-Bafia","Nsam","Mvog-Betsi","Ekié","Omnisport","Oyom-Abang","Mballa II","Elig-Essono","Madagascar","Damase","Nkomo","Djoungolo","Olezoa","Awae","École de poste","Bonass","Rond-point Express","Jouvence","Tam-tam"],
  },
  {
    name: "Zone très éloignée",
    fee: 3000,
    neighborhoods: ["Nyom","Soa","Nkozoa","Minkan","Odza Borne 12"],
  },
] as const;

export const OTHER_NEIGHBORHOOD_VALUE = "__OTHER__";

export function isOtherNeighborhood(value: string) {
  return value === OTHER_NEIGHBORHOOD_VALUE;
}

export function getDeliveryFee(neighborhood: string): number | null {
  if (!neighborhood || isOtherNeighborhood(neighborhood)) return null;
  for (const zone of DELIVERY_ZONES) {
    if ((zone.neighborhoods as readonly string[]).includes(neighborhood)) return zone.fee;
  }
  return null;
}
