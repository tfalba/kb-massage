import { useState } from "react";
import AccordionModal from "../components/AccordionModal/AccordionModal";
import { services } from "../data/ServicesData";

export default function Services() {
  const [isOpen, setIsOpen] = useState<number>(-1);
  const [prevOpen, setPrevOpen] = useState<number>(0);
  function handleChange(index: number) {
    if (index === isOpen) {
      setPrevOpen(index);
      console.log("setting to null");
      setIsOpen(-1);
    } else {
      setIsOpen(index);
      setPrevOpen(isOpen);
    }
  }

  return (
    <main>
      <section>
        <h2 className="services-title">{""}</h2>
        <div className="flex flex-col md:flex-row bg-earth ">
              <div
            className={`${isOpen !== -1 ? "display-none" : "ff-b Home-image flex-[9]"}`}
            style={{
              width: "100%",
              height: 'auto',
              minHeight: "30vh",
              placeContent: "center",
              textAlign: "center",
              fontSize: "calc(12px + 2vw)",
              color: "white",
            }}
          >
            Learn more about our services
          </div>
          {services.map((service, idx) => (
            <AccordionModal
              key={idx}
              title={service.name}
              idx={idx}
              prevOpen={prevOpen}
              isOpen={isOpen === idx}
              handleOpen={() => handleChange(idx)}
            >
              <article
                className="service-card flex flex-col items-center gap-2 motion-safe:animate-service-text sm:flex-row md:flex-col lg:flex-row lg:items-stretch"
                key={idx}
              >
                <div className="service-media" style={{ flex: "1" }}>
                  <img
                    style={{
                      height:
                        service.name === "Sweedish Massage" ? "105%" : "100%",
                    }}
                    src={service.img}
                    alt={service.name}
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-[2] max-h-[92%] flex-col gap-2 overflow-y-auto py-2">
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-desc ff-b leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </article>
            </AccordionModal>
          ))}
          {/* <div
            className={`${isOpen !== -1 ? "display-none" : "ff-b"}`}
            style={{
              width: "100%",
              placeContent: "center",
              textAlign: "center",
              fontSize: "calc(12px + 2vw)",
              color: "white",
            }}
          >
            Learn more about our services
          </div> */}
        </div>
        <div
          style={{
            textAlign: "justify",
            height: "auto",
            padding: "6vw 8vw",
            fontSize: "calc(8px + max(1vw, 1vh))",
            background: "radial-gradient(#d2ffaa45, #d7e8e0)",
          }}
          className="services-title ff-m"
        >
          {/* At Kara Bazemore Massage Therapy, every service is thoughtfully
          designed to support your body’s natural ability to heal, restore, and
          thrive. Whether you’re seeking deep therapeutic relief, total
          relaxation, or a tailored blend of techniques, each session reflects
          years of training, refined skill, and genuine care. From the calming
          flow of Swedish massage to the precision of deep tissue, the athletic
          recovery of sports massage, and the tranquil warmth of hot stone
          therapy, our work is rooted in expertise and intuition. Every
          treatment is customized to your goals, your comfort level, and your
          unique physiology — ensuring you receive not just a massage, but a
          transformative experience. We take pride in providing the highest
          level of professionalism, consistency, and attention to detail. Your
          session is never rushed; it’s crafted to be exactly what your body
          needs that day. You’ll leave feeling balanced, restored, and deeply
          renewed — because we believe that every client deserves nothing less
          than a perfect session. */}
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
