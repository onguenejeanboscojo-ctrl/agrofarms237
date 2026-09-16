export function waLink(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "237697983119";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function formatFCFA(n: number) {
  return n.toLocaleString("fr-FR").replace(/,/g, " ") + " FCFA";
}
