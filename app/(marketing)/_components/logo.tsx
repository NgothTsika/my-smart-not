import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image src="/vercel.svg" alt="logo" width="40" height="40" />
      <p className={cn("font-semibold", font.className)}>
        SmartNot<span className="text-yellow-500  ">.</span>
      </p>
    </div>
  );
};

export default Logo;
