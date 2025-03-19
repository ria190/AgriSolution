import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const LoginWarning = () => {
 
  const images = [
    "/img/agri1.jpg",
    "/img/agri3.jpg",
    "/img/agri4.jpg!d",
    "/img/agri5.jpg",
  ];

  return (
    <div className="relative w-full h-screen">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"></div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg flex flex-col items-center text-center transition-colors duration-300 z-20">
        <h1 className="text-6xl font-extrabold text-red-500 dark:text-red-400 mb-4 animate-bounce">⚠️</h1>
        <h2 className="text-3xl font-bold mb-3">Access Denied</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          You must be logged in to access this page.
        </p>
      </div>
    </div>
  );
};

export default LoginWarning;
