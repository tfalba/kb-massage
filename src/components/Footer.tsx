import logo from "../assets/kara-logo5.png";
import headshot from "../assets/kara-headshot5.jpeg";

export default function Footer() {
  return (
    <footer className="flex justify-between items-center bg-brand-earth text-brand-cream px-[2vw] pt-[2vw] pb-[2vw] ">
      <img className="logo" src={logo} alt="kb logo" loading="lazy" />

      <div className="flex flex-col items-end justify-center">
        <img
          className="flex flex-col items-center w-[min(40vw,200px)]"
          src={headshot}
          alt="kara bazemore"
          loading="lazy"
        />
      </div>
    </footer>
  );
}

