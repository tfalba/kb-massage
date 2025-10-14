import { useState } from 'react';
import AccordionModal from '../components/AccordionModal/AccordionModal';
import { services } from '../data/ServicesData';


export default function Services() {
    const [isOpen, setIsOpen] = useState<number | null>(services.length - 1);
    function handleChange(index: number) {
        if (index === isOpen) {
            console.log('setting to null')
            setIsOpen(null);
        } else {
            setIsOpen(index);
        }

    }

    return (
        <main>
            <section className='services-wrap'>
                <h2 className="services-title">Massage Services</h2>

                <div style={{display: 'flex', width: isOpen || isOpen === 0 ? '100%' : '25%'}} className="service-wrap">
                    {services.map((service, idx) => (
                        <AccordionModal key={idx} title={service.name} idx={idx} isOpen={isOpen===idx} handleOpen={() => handleChange(idx)}>
                        <article style={{display: 'flex', alignItems: 'center' }} className="service-card" key={idx}>
                            <div className="service-media" style={{flex: '1'}}>
                                <img style={{ height: service.name === "Sweedish Massage" ? "105%" : "100%" }} src={service.img} alt={service.name} loading="lazy" />
                            </div>
                            <div style={{flex: '2', maxHeight: '92%', overflowY: 'scroll'}}>
                            <h3 className="service-name">{service.name}</h3>
                            <p className="service-desc">{service.description}</p>
                            </div>
                        </article>

                        </AccordionModal>
                    ))}
                </div>
            </section>
        </main>
    );
}
