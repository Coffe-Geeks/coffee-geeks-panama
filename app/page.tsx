import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background.webp"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Subtle dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* Content wrapper with glass effect */}
      <div className="z-10 flex flex-col items-center justify-center p-8 md:p-14 lg:p-20 rounded-3xl bg-white/10 backdrop-blur-md shadow-2xl border border-white/20 mx-6 transition-all hover:scale-[1.02] duration-700 hover:bg-white/15 hover:shadow-white/10">
        
        {/* Main Logo */}
        <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[450px] md:h-[450px] drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
          <Image
            src="/logo.webp"
            alt="Coffee Geeks Panamá Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Construction indicator below */}
        <div className="mt-8 sm:mt-10 md:mt-12 relative w-[200px] h-[60px] sm:w-[250px] sm:h-[75px] md:w-[350px] md:h-[105px] drop-shadow-xl opacity-90 transition-opacity hover:opacity-100 duration-300">
          <Image
            src="/construccion.webp"
            alt="En Construcción"
            fill
            className="object-contain"
          />
        </div>

      </div>
    </main>
  );
}
