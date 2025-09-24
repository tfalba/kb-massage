import { useState } from 'react';
import photo1 from '../assets/spa-photo-1.png';
import photo2 from '../assets/spa-photo-2.png';
import photo3 from '../assets/spa-photo-3.png';
import photo4 from '../assets/spa-photo-4.png';
import photo5 from '../assets/spa-photo-5.png';
import photo6 from '../assets/spa-photo-6.png';
import photo7 from '../assets/spa-photo-7.png';
import photo8 from '../assets/spa-photo-8.png';


const images = [
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
  // Add more image paths as needed
];

export default function PhotoGrid() {
    const randomDelay = () => {
        return Math.random() * 3;
    }
    //  useMemo(() => Math.random() * 8, []);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    // const selectedImageIndex = Math.floor(Math.random() * images.length);

  return (
    <section className="PhotoGrid-section">
      <div className="PhotoGrid">
        {images.map((src, idx) => (
          <img onClick={() => setSelectedImageIndex(selectedImageIndex === idx ? null : idx)} key={idx} src={src} alt={`Gallery ${idx + 1}`} className={`${selectedImageIndex === idx ? 'PhotoGrid-img PhotoGrid-img-selected' : 'PhotoGrid-img'} spin-y-3`} 
          style={{ animationDelay: `${randomDelay()}s` }} />
        ))}
      </div>
    </section>
  );
}