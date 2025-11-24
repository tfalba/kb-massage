import { Link } from "react-router-dom";
import AccordionGallery from "../components/AccordionGallery/AccordionGallery";
import { images, quotes } from "../data/AccordionData";
import ReviewGallery from "../components/ReviewGallery/ReviewGallery";

function Home() {
    return (
        <main className='main'>
            <div className='Home-image hero-banner flex flex-col jcc aic'>
                <div className='Home-banner-title jcc ff-b'>Find Your Bliss
                </div>
                <h3>Kara Bazemore<span style={{ fontSize: 'calc(8px + .8vw)' }}>{' LMBT, NMT'}</span></h3>
            </div>
            <AccordionGallery slides={images} minCollapsed={40} />
            <div className='Home-welcome flex flex-col gap-4 fs-main ff-m'>
                <h2 style={{ color: "#5d5340" }} >Our Philosophy</h2>

                <p>We believe that physical and mental well-being go hand in hand. We don't just offer a brief escape from the daily grind; we offer a lifestyle change. When you regularly make time for yourself, your bliss can bless every part of your life with more energy and peace.

                    Sign up now for our wide variety of fitness programs and wellness therapies!</p>
                <Link className='button' to="/about">About me</Link>
            </div>
            <ReviewGallery slides={quotes} minCollapsed={40} spin={false} manualTrip={false} />
        </main>
    );
}

export default Home;