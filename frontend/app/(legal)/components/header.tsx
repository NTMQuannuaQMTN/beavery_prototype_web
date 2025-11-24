import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex items-center p-6">
      <Link href="/">
        <Image
          src="/logo/primary.png"
          alt="Beavery logo"
          width={140}
          height={40}
          priority
          className="cursor-pointer"
        />
      </Link>
    </div>
  );
}

