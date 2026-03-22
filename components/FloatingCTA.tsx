import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function FloatingCTA() {
  return (
    <div className="fixed bottom-6 lg:bottom-10 right-6 lg:right-10 z-50">
      <a
        href="#"
        className="group relative flex items-center gap-4 bg-[#0A0A0A] hover:bg-[#111111] text-white p-2 pr-6 rounded-full border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.2)] hover:border-white/20"
      >
        {/* Glowing backdrop effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
        
        {/* Avatars */}
        <div className="relative flex items-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] overflow-hidden z-20">
            <Image
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e5e7eb"
              alt="Avatar 1"
              width={40}
              height={40}
              className="bg-[#222222]"
              unoptimized
            />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] overflow-hidden z-10 -ml-4">
            <Image
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&backgroundColor=fef08a"
              alt="Avatar 2"
              width={40}
              height={40}
              className="bg-yellow-200"
              unoptimized
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col pr-4 relative z-10">
          <span className="text-[15px] font-semibold tracking-tight text-white leading-tight">
            Get more insights
          </span>
          <span className="text-xs text-gray-400 font-medium">
            Connect with our team
          </span>
        </div>

        {/* Arrow Icon circle */}
        <div className="w-7 h-7 rounded-full bg-[#111111]/10 flex items-center justify-center group-hover:bg-[#111111]/20 transition-colors relative z-10 hidden sm:flex">
          <ArrowUpRight className="w-4 h-4 text-white" strokeWidth={2} />
        </div>
      </a>
    </div>
  );
}
