import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-x-2 w-full h-full">
      <Image
        src="/logodark.png"
        alt="logo"
        width="100"
        height="100"
        className="dark:hidden"
      />
      <Image
        src="/logo.png"
        alt="logo"
        width="100"
        height="100"
        className=" hidden dark:block"
      />
    </div>
  );
};

export default Logo;
