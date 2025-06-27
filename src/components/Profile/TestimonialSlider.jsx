import React, { useEffect, useState } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Priya S., Student',
    comment: 'Stand Alone App transformed my college search with detailed insights and amazing travel planning tools!',
    rating: 4,
  },
  {
    name: 'Arjun M., Student',
    comment: 'The personalized admission support made my journey to my dream college so smooth!',
    rating: 5,
  },
  {
    name: 'Ritika Sharma, DU Aspirant',
    comment: 'Loved the clean UI and how easy it was to shortlist colleges based on my interests.',
    rating: 4,
  },
  {
    name: 'Karan Mehta, Parent',
    comment: 'Helped me guide my daughter through the admission process, stress-free!',
    rating: 5,
  },
  {
    name: 'Sneha R., NEET Aspirant',
    comment: 'The travel cost estimation feature saved me a lot of time and money!',
    rating: 4,
  },
  {
    name: 'Amitav Ghosh, JEE Mentor',
    comment: 'My students use this app for all their college research. Highly recommend it.',
    rating: 5,
  },
  {
    name: 'Tanvi Kapoor, 12th CBSE',
    comment: 'Got a clear roadmap of all available colleges. It made decision-making much easier.',
    rating: 4,
  },
  {
    name: 'Dev Rajput, Student',
    comment: 'I used this app daily during my counseling period. Super helpful!',
    rating: 5,
  },
  {
    name: 'Nikita Verma, Mumbai',
    comment: 'I appreciate the scholarship information section, which is often ignored by other platforms.',
    rating: 3,
  },
  {
    name: 'Rahul Jha, Patna',
    comment: 'Even tier-2 college details are well-organized. Hats off to the team!',
    rating: 4,
  },
  {
    name: 'Shreya Sen, Kolkata',
    comment: 'One of the few apps that includes both academics and lifestyle info. Love the balance!',
    rating: 5,
  },
  {
    name: 'Manoj Kumar, Kota',
    comment: 'The counselor recommendations felt like I had a personal mentor. Very grateful.',
    rating: 5,
  },
];

const TestimonialSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const { comment, name, rating } = testimonials[index];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-blue-900 font-bold text-center mb-12">
          What Our Users Say
        </h2>

        <div className="bg-white rounded-lg shadow-md p-6 text-center transition-all duration-500 ease-in-out">
          <div className="flex justify-center mb-4">
            {[...Array(rating)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-lg sm:text-xl" />
            ))}
            {[...Array(5 - rating)].map((_, i) => (
              <FaStar key={`empty-${i}`} className="text-gray-300 text-lg sm:text-xl" />
            ))}
          </div>
          <p className="text-sm sm:text-base text-gray-600 italic mb-4">
            "{comment}"
          </p>
          <h4 className="text-base sm:text-lg text-blue-900 font-semibold">
            {name}
          </h4>
        </div>

        {/* Left Arrow */}
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-blue-100 transition"
          aria-label="Previous testimonial"
        >
          <FaChevronLeft className="text-blue-900" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-blue-100 transition"
          aria-label="Next testimonial"
        >
          <FaChevronRight className="text-blue-900" />
        </button>
      </div>
    </section>
  );
};

export default TestimonialSlider;
