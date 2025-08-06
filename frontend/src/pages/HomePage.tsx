import { useEffect, useState } from "react";
import type { JSX } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import Marquee from "react-fast-marquee";
import Tilt from "react-parallax-tilt";
import useSound from "use-sound";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Sparkles } from "@react-three/drei";
import {
  Music,
  Activity,
  PartyPopper,
  Users,
  CalendarPlus,
} from "lucide-react";

export function HomePage() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [play] = useSound("/sounds/pop.mp3", { volume: 0.3 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    play();
  }, [play]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white font-mono">
      {showConfetti && <Confetti width={dimensions.width} height={dimensions.height} recycle={false} />} 
      <Background3D />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 py-24 text-center">
        <Marquee speed={90} gradient={false} className="text-3xl sm:text-5xl font-black text-pink-400">
          🎉 FIND YOUR VIBE • JOIN A MOMENT • MATCHUP CHANGES HOW YOU MEET 🎉
        </Marquee>

        <motion.h1
          initial={{ scale: 0.3, rotate: 270, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
          className="text-7xl sm:text-9xl font-extrabold bg-gradient-to-br from-purple-400 via-yellow-300 to-pink-600 bg-clip-text text-transparent drop-shadow-[0_0_60px_rgba(255,255,255,0.5)] tracking-tight"
        >
          MATCHUP
        </motion.h1>

        <motion.p
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-8 text-xl sm:text-2xl max-w-3xl text-white/80 leading-relaxed"
        >
          MatchUp is your new way to meet people through real-world hobbies. No swipes. No pressure. Just people who love what you love.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-6xl"
        >
          {features.map((f, i) => (
            <Tilt
              key={i}
              glareEnable={true}
              glareMaxOpacity={0.4}
              tiltMaxAngleX={25}
              tiltMaxAngleY={25}
              className="transform"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-6 text-left shadow-2xl border border-white/10 backdrop-blur-xl hover:shadow-pink-500/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-4 text-yellow-300 text-4xl animate-pulse">
                  {f.icon}
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
                  {f.title}
                </h3>
                <p className="text-white/70 text-lg leading-relaxed">{f.desc}</p>
              </motion.div>
            </Tilt>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: <Activity />,
    title: "Epic Activities",
    desc: "Running, hiking, skating, yoga, or dancing – find your people and go move.",
  },
  {
    icon: <Music />,
    title: "Creative Hangouts",
    desc: "Music jams, painting circles, photography meetups – show up and vibe.",
  },
  {
    icon: <PartyPopper />,
    title: "Pop-Up Events",
    desc: "Flash mobs, rooftop talks, silent discos – MatchUp means surprise and joy.",
  },
];

function Background3D() {
  return (
    <Canvas className="fixed inset-0 z-0">
      <ambientLight intensity={1.5} />
      <Stars radius={120} depth={80} count={8000} factor={4} fade speed={2} />
      <Sparkles count={300} speed={1} size={2} color="white" />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
    </Canvas>
  );
}
