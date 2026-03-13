"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const LogoAnimation = dynamic(() => import("@/components/logo-animation"), {
  ssr: false,
  loading: () => <div className="w-[300px] h-[300px]" />,
});

export default function LoadingPage() {
  const router = useRouter();
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (animationDone) {
      const timer = setTimeout(() => {
        router.push("/terminal");
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [animationDone, router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center">
        <LogoAnimation
          logoSrc="/images/logo_2.png"
          width={300}
          height={300}
          className="mx-auto"
          onAnimationComplete={() => setAnimationDone(true)}
        />
      </div>
    </div>
  );
}
