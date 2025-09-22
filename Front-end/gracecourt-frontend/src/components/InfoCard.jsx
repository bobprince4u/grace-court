/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";

const InfoCard = ({ title, description, Icon, delay = 0 }) => {
  return (
    <motion
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05 }}
      className="bg-[#FAFAFA] shadow-md rounded-2xl p-6 text-center flex flex-col items-center justify-center hover:shadow-xl transition w-full md:w-1/3"
    >
      {Icon && (
        <div className="p-3 rounded-full mb-4 bg-[#FAFAFA]">
          <Icon className="w-8 h-8 text-neutral-900" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </motion>
  );
};

export default InfoCard;
