'use client';

import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

// Define the shape of a Badge
export interface HeroBadge {
    label: string;
    className: string;
}

interface HeroSectionProps {
    // Content
    title: string;
    subtitle: string;
    description: string;
    badges: HeroBadge[];
    ctaLink?: string;
    ctaText?: string;

    // Visual Customization (Optional - with defaults)
    /** The gradient class for the big title text */
    titleGradient?: string;
    /** The gradient class for the CTA button */
    buttonGradient?: string;
    /** The colors for the background blobs (accepts full tailwind classes) */
    blobColors?: {
        topRight: string;
        bottomLeft: string;
    };
}

export function HeroSection({
    title,
    subtitle,
    description,
    badges,
    ctaLink,
    ctaText,
    titleGradient = "from-green-400 to-emerald-600",
    buttonGradient = "from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700",
    blobColors = {
        topRight: "from-green-400/10 to-emerald-600/10",
        bottomLeft: "from-emerald-500/10 to-green-400/10"
    }
}: HeroSectionProps) {

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Dynamic Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br rounded-full blur-3xl ${blobColors.topRight}`} />
                <div className={`absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr rounded-full blur-3xl ${blobColors.bottomLeft}`} />
            </div>

            <motion.div
                className="relative z-10 text-center max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent ${titleGradient}`}>
                        {title}
                    </h1>
                </motion.div>

                <motion.p
                    className="text-xl sm:text-2xl md:text-3xl mb-8 text-gray-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {subtitle}
                </motion.p>

                <motion.p
                    className="text-base sm:text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    {description}
                </motion.p>

                {/* Badges Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto"
                >
                    {badges.map((badge, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{
                                delay: 0.7 + index * 0.1,
                                duration: 0.4,
                                ease: "easeOut",
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium border border-white/10 
                ${badge.className} backdrop-blur-sm hover:border-white/20 transition-all duration-300
                hover:scale-105 cursor-pointer`}
                        >
                            {badge.label}
                        </motion.span>
                    ))}
                </motion.div>

                <br />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    {ctaLink && (ctaText) &&
                        <a
                            href={ctaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                size="lg"
                                className={`bg-gradient-to-r ${buttonGradient} text-white font-semibold px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-white/10 hover:scale-105 transition-all duration-300`}
                            >
                                {ctaText} <Rocket className="ml-2 h-5 w-5" />
                            </Button>
                        </a>}
                </motion.div>
            </motion.div>
        </section>
    );
}