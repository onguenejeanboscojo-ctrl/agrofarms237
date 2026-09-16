import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-waterDeep py-14 pb-24 text-paper/70">
      <div className="mx-auto max-w-[1180px] px-5">
        <div className="mb-8 flex flex-wrap justify-between gap-8">
          <div>
            <div className="font-serif text-2xl font-bold text-paper">Agrofarms237</div>
            <div className="mt-1.5 font-serif italic text-gold">La qualité commence à la ferme.</div>
          </div>
          <div className="flex gap-3">
            <a href="https://wa.me/237697983119" target="_blank" rel="noopener" className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/25" aria-label="WhatsApp">
              WA
            </a>
          </div>
        </div>
        <div className="border-t border-paper/15 pt-5 text-[13px]">
          © {new Date().getFullYear()} Agrofarms237 — Yaoundé, Mimboman Open · 659 505 823 · WhatsApp{" "}
          <Link href="https://wa.me/237697983119" className="underline">697 983 119</Link>
        </div>
      </div>
    </footer>
  );
}
