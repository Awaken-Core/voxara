import Image from "next/image";

export function HeroPattern() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#090909]">
            <Image
                src="/background-bg.png"
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) calc(100vw - 16rem), 100vw"
                className="object-cover object-bottom opacity-70 saturate-75"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,.78)_0%,rgba(8,8,8,.5)_42%,rgba(5,5,5,.78)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_26%,rgba(255,255,255,.07),transparent_48%)]" />
        </div>
    );
}
