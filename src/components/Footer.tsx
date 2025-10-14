import logo from "../assets/kara-logo5.png";
import headshot from "../assets/kara-headshot5.jpeg";

export default function Footer() {
  return (
    <footer>
      <img className="logo" src={logo} alt="kb logo" loading="lazy" />

      <div className="Navbar-links flex-col">
        <img
          className="Footer-image flex-col aic"
          src={headshot}
          alt="kara bazemore"
          loading="lazy"
        />
      </div>
    </footer>
  );
}
