import Image from "next/image";
import { asset } from "@/lib/assets";
import { yonseiLogo, yonseiBold } from "@/lib/fonts";

// Follows Yonsei's own site-header convention (yonsei.ac.kr, symbol beside
// "연세대학교" large / "YONSEI UNIVERSITY" small tracked-out caps beneath):
// Korean is the primary line, English is a smaller, letter-spaced caption
// under it — not the other way around, and not sized to "match" each other.
export default function CenterLogo() {
  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <Image
        src={asset("/img/logo/yonsei-seal.png")}
        alt=""
        width={780}
        height={780}
        className="h-16 w-16 shrink-0 sm:h-20 sm:w-20"
      />
      <div className="leading-tight text-[#003477]">
        <h1 className={`${yonseiBold.className} text-lg whitespace-nowrap sm:text-xl`}>
          연세대학교 과학기술학연구센터
        </h1>
        <p
          className={`${yonseiLogo.className} mt-1 text-[10px] tracking-widest whitespace-nowrap uppercase sm:text-xs`}
        >
          Center for Science and Technology Studies
        </p>
      </div>
    </div>
  );
}
