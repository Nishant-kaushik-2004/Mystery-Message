"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoplayMsgCard from "@/components/AutoplayMsgCard";

const HomePage = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <main>
      <div className="min-h-screen bg-gray-900 flex flex-col items-center text-white p-6">
        <motion.h1
          className="text-3xl sm:text-5xl font-bold mb-8 sm:mt-48 mt-32 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to Mystery Message
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Unveil the secrets, one message at a time.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Get Started
          </Link>
        </motion.div>
        <div className="mt-20">
          <Carousel
            plugins={[plugin.current]}
            className="sm:w-full sm:max-w-lg max-w-72 text-black"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={() => plugin.current.play()}
            opts={{ loop: true }}
          >
            <CarouselContent>
              {messages.map((msg, index) => (
                <CarouselItem key={index}>
                  <AutoplayMsgCard message={msg} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <CarouselPrevious className="opacity-70 hover:opacity-90 transition-all" />
              <CarouselNext className="opacity-70 hover:opacity-90 transition-all" />
            </motion.div>
          </Carousel>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
