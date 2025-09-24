import AccordionGallery from '../components/AccordionGallery/AccordionGallery';
import { images } from '../data/AccordionData';
import { services } from '../data/ServicesData';


export default function Services() {
    return (
        <main>
            <section className='services-wrap'>
                <h2 className="services-title">Massage Services</h2>

                <div className="services-grid">
                    {services.map((service, idx) => (
                        <article className="service-card" key={idx}>
                            <div className="service-media">
                                <img style={{ height: service.name === "Sweedish Massage" ? "105%" : "100%" }} src={service.img} alt={service.name} loading="lazy" />
                            </div>
                            <h3 className="service-name">{service.name}</h3>
                            <p className="service-desc">{service.description}</p>
                        </article>
                    ))}
                </div>
            </section>
            <AccordionGallery
                minExpanded={120}
                minCollapsed={40}
                expandable={false}
                slides={images}
            />
        </main>
    );
}
