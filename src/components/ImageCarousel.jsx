import { useState, useEffect } from "react";

const images = [
  "/img/agri1.jpg",
  "/img/agri2.jpg",
  "/img/agri3.jpg",
  "/img/agri4.jpg",
];

const ImageCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {images.map((image, i) => (
        <img
          key={i}
          src={image}
          alt={`Slide ${i + 1}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black opacity-30"></div>
    </div>
  );
};

export default ImageCarousel;
