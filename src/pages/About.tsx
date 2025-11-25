import headshot from "../assets/kara-headshot1.jpeg";
import { aboutMe } from "../data/AboutMeData";

function About() {
  return (
    <main className="min-h-[88vh] bg-brand-cream">
      <div className="flex flex-wrap items-center justify-center gap-6 bg-[radial-gradient(#d2ffaa45,#d7e8e0)] px-[3vw] pb-[6vw] pt-[3vw]">
        <img
          className="flex min-h-[30vw] max-h-[min(400px,100vh)] flex-col items-center justify-end rounded-[24px] border border-brand-sage/30 bg-white shadow-md"
          src={headshot}
          alt="Kara Bazemore headshot"
        />

        <div className="flex min-w-[240px] flex-1 flex-col gap-4 px-[3vw]">
          <p className="m-0 font-belleza text-[clamp(1.6rem,3vw,3.4rem)] text-brand-forest">
            Kara Bazemore
          </p>
          <p className="font-montserrat text-[clamp(1.1rem,1.8vw,2.2rem)] font-semibold text-brand-earth">
            {aboutMe[0].title}
          </p>

          <p className="font-montserrat text-[clamp(1rem,1.2vw,1.4rem)] text-justify leading-relaxed text-brand-earth/80">
            {aboutMe[0].content}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-6 bg-brand-cream px-[8vw] pb-[8vw] pt-[4vw]">
        {aboutMe.slice(1).map((a, i) => (
          <div
            key={a.title}
            className={`flex flex-col rounded-[24px] p-[3vw] text-justify shadow-md ${
              i % 2 === 0 ? "bg-[#ffebeb]" : "bg-brand-sage/30"
            }`}
          >
            <p className="font-montserrat text-[clamp(1.1rem,1.4vw,1.8rem)] font-semibold text-brand-earth">
              {a.title}
            </p>
            <p className="font-montserrat text-[clamp(0.95rem,1.1vw,1.3rem)] leading-relaxed text-brand-earth/90">
              {a.content}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default About;
