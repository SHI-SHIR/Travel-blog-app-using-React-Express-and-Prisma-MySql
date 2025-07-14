import React from "react";
import {
  FaInstagram,
  FaWhatsapp,
  FaTwitter,
  FaFacebook,
  FaTiktok,
} from "react-icons/fa";
import Navbar from "./Navbar";

const About = () => {
  return (
    <>

    <Navbar />
    <div className="min-h-screen bg-white text-gray-900 px-6 py-16 font-sans mt-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-5xl font-extrabold text-zinc-400 tracking-wide mb-6 text-center">
          About Talk to Local
        </h1>

        <section className="space-y-6 text-lg leading-relaxed">
          <p>
            <strong className="text-yellow-500 italic">What is Talk to Local?</strong>
          </p>
          <p>
            Talk to Local is all about telling real stories the local way. We dive into Nepal’s hidden
            corners—those underrated, off-the-radar places that most travelers miss—and bring them
            to life through photos, videos, and honest storytelling.
          </p>
          <p>
            While the big tourist spots are always buzzing, we’re drawn to the calm and charm of
            lesser-known places. They’re quieter, more affordable, and often way more authentic.
            These are the spots where the heart of Nepalese culture still beats strong—untouched by
            the noise of mass tourism.
          </p>
          <p>
            As someone from a middle-class background, I know that travel can get expensive.
            That’s why I chase destinations that are easier on the wallet but rich in experience. I
            believe the real magic lies in the places people overlook—the hidden gems where tradition
            lives on, and where you don’t just see the place, you <em>feel</em> it.
          </p>
        </section>

        <section className="space-y-6 text-lg leading-relaxed">
          <p>
            <strong className="text-yellow-500 italic">Raw & Real</strong>
          </p>
          <p>
            At Talk to Local, I don’t just tell stories—I live them. I’m a storyteller and
            photographer chasing the raw, the real, and the untouched corners of Nepal. My lens
            doesn’t glamorize. It captures life as it is: honest, imperfect, deeply human.
          </p>
          <p>
            Through my photography and the faces I meet, I try to show the world what most people
            overlook. The smile of a farmer. The eyes of a grandmother who’s seen generations pass.
            The wrinkles, the weather, the warmth—it’s all part of the story. These people aren’t
            trying to impress anyone. They’re just being. And that’s what makes their stories so
            powerful.
          </p>
          <p>
            I travel to places untouched by crowds—underdeveloped villages, rugged landscapes, raw
            nature sculpted by time. I walk into homes where life is simple, yet filled with soul.
            And with every step, every conversation, I learn to slow down, to listen, and to feel.
          </p>
          <p>
            For me, travel isn’t about checklists. It’s about connection. It’s about asking: Who am I
            when I’m far from everything familiar? I find myself in their stories. I see reflections
            of my own journey in their struggles, their joys, their quiet pride.
          </p>
          <p>
            This is more than just travel. It’s my meditation. My art. My truth.
          </p>
          <p>
            So if you’re someone who wants to feel a place—not just visit it—you’re in the right spot.
            Let’s explore the raw and the <em>real</em> together.
          </p>
        </section>

        <footer className="mt-16 border-t border-yellow-700 pt-8 text-center">
          <h2 className="text-3xl font-semibold mb-4 text-yellow-500">Contact Us</h2>
          <div className="flex justify-center space-x-8 text-yellow-500 text-3xl">
            <a
              href="https://www.instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-yellow-300 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/yourwhatsappnumber"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-yellow-300 transition"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://twitter.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-yellow-300 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://facebook.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-yellow-300 transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.tiktok.com/@yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="hover:text-yellow-300 transition"
            >
              <FaTiktok />
            </a>
          </div>
          <p className="mt-7 text-yellow-600 text-sm">
            © {new Date().getFullYear()} Talk to Local. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
    </>
  );
};

export default About;
