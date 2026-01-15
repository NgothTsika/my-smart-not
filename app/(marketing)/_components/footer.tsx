import { Button } from "@/components/ui/button";
import Logo from "./logo";

const Footer = () => {
  return (
    <div className=" flex items-center w-full bg-background z-50 dark:bg-[#1F1F1F] px-5  ">
      <div className=" hidden md:flex ">
        <Logo />
      </div>
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground ">
        <Button variant="ghost" size="sm">
          Privacy Policy
        </Button>
        <Button variant="ghost" size="sm">
          Terms & Conditions
        </Button>
      </div>
    </div>
  );
};

export default Footer;
