/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Leaf, 
  Apple, 
  Utensils, 
  Heart, 
  Brain, 
  Smile, 
  Zap, 
  ChevronRight, 
  Instagram, 
  Facebook, 
  Twitter,
  Send,
  Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulate preloader
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    setIsSubmitting(true);
    setTestResult(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `En tant qu'expert en nutrition bienveillante pour la plateforme "Manger mieux, vivre mieux", réponds à ce message d'un utilisateur qui décrit sa journée ou ses sentiments alimentaires : "${testInput}". 
        Donne 3 conseils simples, doux et non culpabilisants pour l'aider à trouver un meilleur équilibre. 
        Ta réponse doit être encourageante, en français, et organisée avec des puces. 
        Évite le langage trop technique ou restrictif. 
        Maximum 150 mots.`,
      });
      setTestResult(response.text || "Désolé, je n'ai pas pu générer de conseils pour le moment.");
    } catch (error) {
      console.error("Gemini Error:", error);
      setTestResult("Oups, une erreur est survenue lors de la génération de vos conseils. Réessayez plus tard !");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-wellness-beige z-50">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-wellness-pink-bright"
        >
          <Leaf size={64} fill="currentColor" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 font-medium text-wellness-pink-bright"
        >
          Bienvenue chez vous...
        </motion.p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-neutral-900 text-neutral-100' : 'bg-pink-50 text-neutral-800'}`}>
      
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 glass shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold text-wellness-pink-bright"
          >
            Manger mieux, vivre mieux
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['Accueil', 'Les bases', 'Idées de repas', 'Habitudes', 'Test personnalisé'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
                className="hover:text-wellness-pink-bright transition-colors font-medium text-sm lg:text-base"
              >
                {item}
              </a>
            ))}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-wellness-pink-sparkle/20 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-wellness-pink-sparkle/20 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-wellness-beige dark:bg-neutral-800 overflow-hidden"
            >
              <div className="flex flex-col px-6 py-4 space-y-4">
                {['Accueil', 'Les bases', 'Idées de repas', 'Habitudes', 'Test personnalisé'].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-wellness-pink-bright py-2 border-b border-wellness-pink-sparkle/20"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-20">
        
        {/* Section Accueil (Hero) */}
        <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0 text-center">
            <img 
              src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=2000" 
              alt="Healthy food background" 
              className="w-full h-full object-cover opacity-20 dark:opacity-10"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-pink-50/0 to-pink-50 dark:to-neutral-900" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
              <div className="text-center lg:text-left">
                <motion.h1 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="text-4xl md:text-6xl font-black leading-tight mb-8 text-wellness-pink-bright"
                >
                  Apprendre à mieux manger sans priver
                </motion.h1>
                <motion.p 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{...fadeIn, visible: {...fadeIn.visible, transition: { delay: 0.2 }}}}
                  className="text-lg md:text-xl opacity-90 mb-12 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                >
                  Bien manger, ce n'est pas se frustrer ou se contrôler tout le temps. Le but, c'est surtout de trouver un équilibre et de se sentir mieux au quotidien.
                </motion.p>
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="flex flex-wrap justify-center lg:justify-start gap-4"
                >
                  {['Les bases', 'Idées de repas', 'Habitudes', 'Test personnalisé'].map((btn) => (
                    <motion.a
                      key={btn}
                      href={`#${btn.toLowerCase().replace(/ /g, '-')}`}
                      variants={fadeIn}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-wellness-pink-bright/10 dark:bg-wellness-pink-bright/20 border-2 border-wellness-pink-bright text-wellness-pink-bright font-black rounded-full hover:bg-wellness-pink-bright hover:text-white transition-all shadow-lg text-sm md:text-base"
                    >
                      {btn}
                    </motion.a>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative hidden md:block"
              >
                <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white dark:border-neutral-800 transform rotate-3 hover:rotate-0 transition-transform duration-700">
                  <img 
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000" 
                    alt="Salade composée saine" 
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Overlay subtil pour le ton rose */}
                  <div className="absolute inset-0 bg-pink-500/5 mix-blend-overlay pointer-events-none" />
                </div>
                {/* Éléments décoratifs */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-300/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-wellness-pink-bright/10 rounded-full blur-3xl" />
                
                {/* Badge flottant */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-6 -right-6 z-20 bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-xl border border-pink-100 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-wellness-pink-bright">
                    <Heart size={20} fill="currentColor" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-60">Équilibre</div>
                    <div className="font-bold">100% Santé</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-50"
          >
            <ChevronRight className="rotate-90" />
          </motion.div>
        </section>

        {/* Section Les bases */}
        <section id="les-bases" className="py-24 bg-pink-100/50 dark:bg-neutral-800/20">
          <div className="container mx-auto px-6 text-center max-w-4xl mb-16">
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Les bases de l'équilibre
            </motion.h2>
            <motion.p 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-lg opacity-80"
            >
              Manger équilibré, ce n'est pas compliqué. Il suffit d'avoir un peu de tout dans son assiette. Le plus important, ce n'est pas d'être parfait mais d'être régulier.
            </motion.p>
          </div>

          <div className="container mx-auto px-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { 
                  icon: <Zap size={24} />, 
                  title: "Protéines", 
                  desc: "Pour l'énergie durable et la structure de ton corps (viande, poisson, œufs, tofu...).",
                  image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=800",
                  color: "from-pink-500/20 to-wellness-pink-bright/20"
                },
                { 
                  icon: <Leaf size={24} />, 
                  title: "Légumes", 
                  desc: "Des vitamines et des fibres à volonté pour se sentir léger et en pleine forme. Indispensable pour votre santé quotidienne.",
                  image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&q=80&w=800",
                  color: "from-green-500/20 to-emerald-500/20"
                },
                { 
                  icon: <Utensils size={24} />, 
                  title: "Féculents", 
                  desc: "Le carburant de ton cerveau et de tes muscles. Privilégie le complet pour une énergie stable.",
                  image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
                  color: "from-yellow-500/20 to-orange-500/20"
                }
              ].map((card, i) => (
                <motion.div 
                  key={i}
                  variants={fadeIn}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="group bg-white dark:bg-neutral-800 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-pink-100/50 dark:border-neutral-700/50 flex flex-col"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${card.color} opacity-40 group-hover:opacity-20 transition-opacity duration-500`} />
                    <div className="absolute top-6 right-6 p-4 bg-white/90 dark:bg-neutral-900/90 rounded-3xl shadow-lg backdrop-blur-md text-wellness-pink-bright">
                      {card.icon}
                    </div>
                  </div>
                  <div className="p-8 flex-grow">
                    <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                    <p className="opacity-75 leading-relaxed text-base">
                      {card.desc}
                    </p>
                  </div>
                  <div className="px-8 pb-8">
                    <div className="h-1.5 w-12 bg-wellness-pink-bright rounded-full opacity-50 group-hover:w-full transition-all duration-500" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Section Idées de repas */}
        <section id="idées-de-repas" className="py-24 bg-pink-50 dark:bg-neutral-900/10">
          <div className="container mx-auto px-6 mb-16 text-center">
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Inspirations Gourmandes
            </motion.h2>
            <p className="opacity-70">Des idées simples pour ne plus jamais manquer d'inspiration.</p>
          </div>

          <div className="container mx-auto px-6 max-w-6xl">
            <div className="space-y-24">
              {/* Petit-dej */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="order-2 md:order-1"
                >
                  <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Sun className="text-yellow-500" /> Petit-déjeuner
                  </h3>
                  <div className="space-y-4">
                    {[
                      "Yaourt nature + fruit + céréales",
                      "Tartines de pain complet + œufs + avocat",
                      "Smoothie bowl aux baies et noix"
                    ].map((meal, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border border-pink-100/50">
                        <div className="w-2 h-2 bg-wellness-pink-bright rounded-full" />
                        <span className="font-medium text-lg leading-tight">{meal}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="order-1 md:order-2 rounded-[3rem] overflow-hidden shadow-2xl"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800" 
                    alt="Petit déjeuner complet" 
                    className="w-full h-80 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>

              {/* Dejeuner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="rounded-[3rem] overflow-hidden shadow-2xl"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800" 
                    alt="Poulet riz légumes" 
                    className="w-full h-80 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Utensils className="text-wellness-pink-bright" /> Déjeuner
                  </h3>
                  <div className="space-y-4">
                    {[
                      "Poulet + riz + légumes à volonté",
                      "Salade complète (protéines + sauce légère)",
                      "Bowl équilibré : Quinoa, Tempeh et crudités"
                    ].map((meal, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border border-pink-100/50">
                        <div className="w-2 h-2 bg-wellness-pink-bright rounded-full" />
                        <span className="font-medium text-lg leading-tight">{meal}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Diner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="order-2 md:order-1"
                >
                  <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Moon className="text-indigo-400" /> Dîner
                  </h3>
                  <div className="space-y-4">
                    {[
                      "Omelette fondante + salade fraîche",
                      "Poisson grillé + légumes croquants",
                      "Soupe de saison et tartine de fromage frais"
                    ].map((meal, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/50 dark:bg-neutral-800/50 rounded-2xl border border-pink-100/50">
                        <div className="w-2 h-2 bg-wellness-pink-bright rounded-full" />
                        <span className="font-medium text-lg leading-tight">{meal}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="order-1 md:order-2 rounded-[3rem] overflow-hidden shadow-2xl"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800" 
                    alt="Poisson grillé et légumes" 
                    className="w-full h-80 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>

              <div className="text-center italic opacity-60 text-lg">
                L'essentiel est de composer une assiette qui vous fait plaisir tout en respectant vos besoins.
              </div>
            </div>
          </div>
        </section>

        {/* Section Comprendre ses habitudes */}
        <section id="habitudes" className="py-24 bg-pink-100/30 dark:bg-neutral-900/40">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-8">Comprendre ses habitudes</h2>
                <div className="space-y-6 text-lg opacity-85">
                  <p>
                    Parfois, on ne mange pas parce qu'on a faim, mais parce qu'on est stressé, fatigué ou ennuyé. C'est tout à fait normal, ça arrive à tout le monde.
                  </p>
                  <p>
                    Le problème, ce n'est pas le manque de volonté, c’est souvent qu’on ne comprend pas pourquoi on agit comme ça. Et c'est précisément pour cette raison que ce site a été créé !
                  </p>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-4">
                  {[
                    { icon: <Brain size={32} />, label: "Mental" },
                    { icon: <Heart size={32} />, label: "Émotions" },
                    { icon: <Smile size={32} />, label: "Bien-être" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-sm text-wellness-pink-bright">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium opacity-70">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="rounded-3xl overflow-hidden shadow-2xl rotate-2"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" 
                    alt="Self care" 
                    className="w-full h-auto"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-wellness-pink-bright/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Section Test personnalisé */}
        <section id="test-personnalisé" className="py-24 bg-pink-200/10">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="glass p-8 md:p-12 rounded-[3rem] shadow-xl border border-wellness-pink-sparkle/30">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-center mb-10"
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Parle-moi de ta journée</h2>
                <p className="text-lg opacity-70 max-w-2xl mx-auto">
                  Décris ce que tu manges, ce que tu ressens ou tes doutes du moment, et je te donnerai quelques conseils personnalisés et bienveillants.
                </p>
              </motion.div>

              <form onSubmit={handleTestSubmit} className="space-y-6">
                <div>
                  <textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Ex: Aujourd'hui j'ai mangé très vite car j'étais stressé par le travail, et maintenant j'ai faim à 16h..."
                    className="w-full min-h-[150px] p-6 rounded-3xl bg-wellness-pink-soft/50 dark:bg-neutral-800/50 border border-wellness-pink-sparkle/30 focus:ring-4 focus:ring-wellness-pink-sparkle/20 outline-none transition-all resize-none text-lg"
                  />
                </div>
                <div className="text-center">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-10 py-4 bg-wellness-pink-bright text-white rounded-full font-bold text-lg shadow-lg hover:shadow-wellness-pink-bright/40 transition-all flex items-center justify-center gap-3 mx-auto ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" /> Analyse en cours...
                      </>
                    ) : (
                      <>
                        Recevoir mes conseils <Send size={20} />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              <AnimatePresence>
                {testResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-12 p-8 bg-wellness-pink-bright/5 dark:bg-wellness-pink-bright/10 rounded-3xl border-l-8 border-wellness-pink-bright relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Zap size={80} />
                    </div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <SparklesIcon /> Vos conseils personnalisés
                    </h3>
                    <div className="prose dark:prose-invert max-w-none whitespace-pre-line leading-relaxed italic text-lg opacity-90">
                      {testResult}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-pink-100 dark:bg-neutral-900 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="text-2xl font-bold text-wellness-pink-bright mb-4">Manger mieux, vivre mieux</div>
              <p className="opacity-70 max-w-xs">
                Une approche bienveillante de la nutrition pour une vie équilibrée et épanouie.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Liens rapides</h4>
              <div className="flex flex-col space-y-3 opacity-80">
                <a href="#accueil" className="hover:text-wellness-pink-bright transition-colors">Accueil</a>
                <a href="#les-bases" className="hover:text-wellness-pink-bright transition-colors">Les bases</a>
                <a href="#idées-de-repas" className="hover:text-wellness-pink-bright transition-colors">Recettes</a>
                <a href="#test-personnalisé" className="hover:text-wellness-pink-bright transition-colors">Bilan</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-wellness-pink-sparkle/20 rounded-full flex items-center justify-center hover:bg-wellness-pink-bright hover:text-white transition-all">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-wellness-pink-sparkle/20 rounded-full flex items-center justify-center hover:bg-wellness-pink-bright hover:text-white transition-all">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-wellness-pink-sparkle/20 rounded-full flex items-center justify-center hover:bg-wellness-pink-bright hover:text-white transition-all">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-wellness-pink-sparkle/20 text-center opacity-60 text-sm">
            © 2026 Manger mieux, vivre mieux. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-wellness-pink-bright"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
