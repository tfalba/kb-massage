import { Link } from "react-router-dom";
import AccordionGallery from "../components/AccordionGallery/AccordionGallery";
import { images, quotes } from "../data/AccordionData";
import ReviewGallery from "../components/ReviewGallery/ReviewGallery";

function Home() {
  return (
    <main className="w-full bg-brand-cream">
      <div className="flex min-h-[min(80vh,50vw)] flex-col items-center justify-center bg-[url('/src/assets/massage-banner.png')] bg-cover bg-center text-white motion-safe:animate-hero-slide-up">
        <div className="flex w-[92vw] justify-center font-belleza text-[clamp(2.5rem,10vw,8rem)]">
          Find Your Bliss
        </div>
        <h3 className="m-0 font-belleza text-cream text-center text-[clamp(1.2rem,2.2vw,3rem)]">
          Kara Bazemore
          <span className="ml-2 text-[clamp(0.9rem,1.2vw,1.6rem)]">
            LMBT, NMT
          </span>
        </h3>
      </div>
      <AccordionGallery slides={images} minCollapsed={40} />
      <div className="flex flex-col gap-4 bg-[#ab874252] px-[18vw] py-[5vw] text-justify font-montserrat text-[clamp(1rem,1.2vw,1.4rem)] leading-relaxed text-brand-forest">
        <h2 className="font-montserrat text-[clamp(1.4rem,2.8vw,3.2rem)] text-brand-earth font-200">
          Our Philosophy
        </h2>

        <p>
          We believe that physical and mental well-being go hand in hand. We
          don't just offer a brief escape from the daily grind; we offer a
          lifestyle change. When you regularly make time for yourself, your
          bliss can bless every part of your life with more energy and peace.
          Sign up now for our wide variety of fitness programs and wellness
          therapies!
        </p>
        <Link
          className="w-fit rounded-[12px] border-2 border-brand-cream bg-brand-cream px-4 py-2 font-montserrat text-brand-forest transition hover:bg-brand-sage hover:text-white"
          to="/about"
        >
          About me
        </Link>
      </div>
      <ReviewGallery
        slides={quotes}
        minCollapsed={40}
        spin={false}
        manualTrip={false}
      />
    </main>
  );
}

export default Home;
