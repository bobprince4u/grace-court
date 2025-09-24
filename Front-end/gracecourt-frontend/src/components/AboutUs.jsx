import React, { memo, useMemo } from "react";
import { Target, Eye, Diamond } from "lucide-react";
import InfoCard from "./InfoCard";

// Constants moved outside component to prevent re-creation on each render
const ABOUT_DATA = [
  {
    id: 1,
    title: "Our Mission",
    description:
      "To redefine luxury living on the mainland by creating modern, stylish, and functional apartments that feel like home, yet elevate every moment with comfort and class.",
    icon: Target,
  },
  {
    id: 2,
    title: "Our Vision",
    description:
      "To become the premier choice for premium serviced apartments in Lagos, setting the standard for quality, design, and hospitality.",
    icon: Eye,
  },
  {
    id: 3,
    title: "Our Values",
    description:
      "At Gracecourt, we value Excellence. Transparency, Comfort, Innovation and Community.",
    icon: Diamond,
  },
];

const AboutUs = memo(() => {
  // Memoize the aboutData to prevent unnecessary recalculations
  const aboutData = useMemo(() => ABOUT_DATA, []);

  // Memoize the rendered cards for performance
  const renderedCards = useMemo(() => {
    return aboutData
      .map((item, i) => {
        try {
          return (
            <InfoCard
              key={item.id}
              title={item.title}
              description={item.description}
              Icon={item.icon}
              delay={i * 0.2}
            />
          );
        } catch (error) {
          // Log error but don't break the UI
          console.error(`Error rendering InfoCard for ${item.title}:`, error);
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries
  }, [aboutData]);

  return (
    <section className="py-12 px-6 mt-16 text-center">
      <h2 className="text-3xl font-bold mb-10 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
        About Us
      </h2>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        {renderedCards}
      </div>
    </section>
  );
});

// Set display name for debugging
AboutUs.displayName = "AboutUs";

export default AboutUs;
