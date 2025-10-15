import headshot from "../assets/kara-headshot1.jpeg";
import { aboutMe } from "../data/AboutMeData";

function About() {
  return (
    <main className="About-container">
      <div className="About-top-container jcc aic flex-wrap">
        <img
          className="About-image flex-col aic"
          src={headshot}
          alt="tf mortgage services"
        />

        <div className="About-top-section flex-col jcc">
          <p className="About-top-title m0 ff-b">Kara Bazemore</p>
          <p className="About-title ff-m">{aboutMe[0].title}</p>

          <p className="About-content ff-m">{aboutMe[0].content}</p>
        </div>
      </div>
      <div className="About-lower-container jcc flex-wrap">
        {aboutMe.slice(1).map((a, i) => (
          <div
            className={`About-section flex-col ${
              i % 2 === 0 ? "About-section-even" : "About-section-odd"
            }`}
          >
            <p className="About-title ff-m">{a.title}</p>
            <p className="About-content ff-m">{a.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default About;
