"use client";

import Image from "next/image";

interface AvatarProps {
  src: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  const fallbackImage = "/images/avatar.jpeg";
  const isValidSrc = src?.startsWith("http") || src?.startsWith("/");

  return (
    <Image
      alt="Avatar"
      className="rounded-full border shadow"
      height={35}
      width={35}
      src={isValidSrc ? src! : fallbackImage}
    />
  );
};

export default Avatar;
