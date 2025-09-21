
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/Ascend.svg"
      alt="Ascend Logo"
      width={60}
      height={60}
      className={className}
    />
  );
}
