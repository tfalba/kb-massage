import { useState } from "react";
import AccordionModal from "../components/AccordionModal/AccordionModal";
import { services } from "../data/ServicesData";

export default function Services() {
  const [isOpen, setIsOpen] = useState<number>(-1);
  const [prevOpen, setPrevOpen] = useState<number>(0);
  function handleChange(index: number) {
    if (index === isOpen) {
      setPrevOpen(index);
      setIsOpen(-1);
    } else {
      setIsOpen(index);
      setPrevOpen(isOpen);
    }
  }

  const heroPanel =
    isOpen !== -1
      ? "hidden"
      : "flex w-full flex-[9] min-h-[30vh] bg-[url('/src/assets/massage-banner.png')] bg-cover bg-center bg-no-repeat";

  return (
    <main className="w-full">
      <section>
        <h2 className="sr-only">Massage Services</h2>
        <div className="flex flex-col bg-brand-forest text-white md:flex-row pt-[min(50px,20vh)]">
          <div
            className={`${heroPanel} grid place-content-center px-6 py-10 text-center font-belleza text-[clamp(1.5rem,2.4vw,3.5rem)]`}
          >
            Learn more about our services
          </div>
          {services.map((service, idx) => (
            <AccordionModal
              key={service.name}
              title={service.name}
              idx={idx}
              prevOpen={prevOpen}
              isOpen={isOpen === idx}
              handleOpen={() => handleChange(idx)}
            >
              <article className="m-[2vw] flex flex-col items-center gap-4 rounded-[14px] bg-brand-cream p-[2vw] text-brand-earth shadow-md motion-safe:animate-service-text sm:flex-row md:flex-col lg:flex-row">
                <div className="flex w-auto flex-1 flex-col">
                  <div className={`${idx===0 || idx===4 ? "aspect-[1]" : "aspect-[3/2]"} "overflow-hidden"`}>
                    <img
                      className={`h-full w-full p-[1vw] object-contain ${
                        service.name === "Sweedish Massage"
                          ? "scale-[1.05]"
                          : "scale-100"
                      }`}
                      src={service.img}
                      alt={service.name}
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="flex max-h-[92%] flex-[2] flex-col gap-3 overflow-y-auto py-2">
                  <h3 className="text-[clamp(1.1rem,1.6vw,2rem)] font-belleza text-brand-forest">
                    {service.name}
                  </h3>
                  <p className="font-montserrat text-[clamp(0.9rem,1.1vw,1.25rem)] leading-relaxed text-[#555]">
                    {service.description}
                  </p>
                </div>
              </article>
            </AccordionModal>
          ))}
        </div>
        <div className="bg-[radial-gradient(#d2ffaa45,#d7e8e0)] px-[8vw] py-[6vw] text-justify font-montserrat text-[clamp(1rem,1.3vw,1.6rem)] text-brand-forest">
          At Kara Bazemore Massage Therapy, every session is a blend of skill,
          intuition, and years of professional training. Our techniques are
          designed to relieve tension, restore balance, and promote lasting
          well-being. Whether you’re seeking deep healing or pure relaxation, we
          guarantee a session tailored perfectly to you.
        </div>
      </section>
    </main>
  );
}
