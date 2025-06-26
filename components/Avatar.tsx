"use client";

import Image from "next/image";

interface AvatarProps {
  src: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  const fallbackImage = "/images/avatar.png"; // Default fallback image
  const isValidSrc = src?.startsWith("http") || src?.startsWith("/");

  return (
    <Image
      alt="Avatar"
      className="rounded-full border border-yellow-400 dark:border-yellow-500"
      height={30}
      width={30}
      src={isValidSrc ? src! : fallbackImage} // Use fallback if src is invalid
    />
  );
};

export default Avatar;
