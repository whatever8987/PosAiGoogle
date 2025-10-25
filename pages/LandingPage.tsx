import React, { useState, useEffect } from 'react';
import { Sun, Moon, Github, Bot, Search, Users, BrainCircuit, Mic, Sparkles, Database, ArrowRight, Pause, Play, Maximize2, Check } from 'lucide-react';
import type { Theme } from '../types';

interface LandingPageProps {
    onLoginClick: () => void;
    onRegisterClick: () => void;
}

const GlassmorphicCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`relative bg-gray-500/10 dark:bg-white/5 backdrop-blur-md border border-gray-500/20 dark:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-gray-500/30 dark:hover:border-white/20 hover:shadow-2xl ${className}`}>
        {children}
    </div>
);

const LandingHeader: React.FC<{ theme: Theme; onThemeToggle: () => void; onLoginClick: () => void; }> = ({ theme, onThemeToggle, onLoginClick }) => (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <img src="https://em-content.zobj.net/source/microsoft-teams/363/deer_1f98c.png" alt="DeerFlow Logo" className="w-8 h-8"/>
                <span className="font-bold text-xl text-slate-800 dark:text-white">DeerFlow</span>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={onThemeToggle} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800" aria-label="Toggle theme">
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                 <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-slate-200/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <Github className="w-4 h-4" />
                    <span>Star on GitHub</span>
                    <span className="bg-slate-300 dark:bg-slate-700 px-2 rounded-md">17,638</span>
                </a>
                <button onClick={onLoginClick} className="p-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800">
                    Login
                </button>
            </div>
        </div>
    </header>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onRegisterClick }) => {
    const [theme, setTheme] = useState<Theme>('dark');
    
    useEffect(() => {
        const doc = document.documentElement;
        doc.classList.remove(theme === 'dark' ? 'light' : 'dark');
        doc.classList.add(theme);
        // Also update body background for page-specific styling
        document.body.className = theme === 'dark' ? 'bg-[#111111]' : 'bg-white';
    }, [theme]);
    
    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    const caseStudies = [
        { icon: Bot, title: "How tall is Eiffel Tower compared to tallest building?", description: "The research compares the heights and global significance of the Eiffel Tower and Burj Khalifa, and uses Python code to calculate the multiples." },
        { icon: Github, title: "What are the top trending repositories on GitHub?", description: "The research utilized MCP services to identify the most popular GitHub repositories and documented them in detail using search engines." },
        { icon: Mic, title: "Write an article about Nanjing's traditional dishes", description: "The study vividly showcases Nanjing's famous dishes through rich content and imagery, uncovering their hidden histories and cultural significance." },
        { icon: Sparkles, title: "How to decorate a small rental apartment?", description: "The study provides readers with practical and straightforward methods for decorating apartments, accompanied by inspiring images." },
    ];
    
    const coreFeatures = [
        { icon: Search, title: "Dive Deeper and Reach Wider", description: "Unlock deeper insights with advanced tools. Our powerful search + crawling and Python tools gathers comprehensive data, delivering in-depth reports to enhance your study." },
        { icon: BrainCircuit, title: "Lang Stack", description: "Build with confidence using the LangChain and LangGraph frameworks." },
        { icon: Users, title: "Human-in-the-loop", description: "Refine your research plan, or adjust focus areas all through simple natural language.", learnMore: true },
        { icon: Database, title: "MCP Integrations", description: "Supercharge your research workflow and expand your toolkit with seamless MCP integrations." },
        { icon: Mic, title: "Podcast Generation", description: "Instantly generate podcasts from reports. Perfect for on-the-go learning or sharing findings effortlessly." }
    ];

    const pricingTiers = [
      {
        name: 'Hobbyist',
        price: '$0',
        period: '/ month',
        description: 'For individuals and small projects getting started.',
        features: ['1 User', '5 Integrations', 'Basic Insights', 'Community Support'],
        ctaText: 'Get Started Free',
        isFeatured: false,
      },
      {
        name: 'Pro',
        price: '$29',
        period: '/ month',
        description: 'For growing businesses and professionals who need more power.',
        features: ['5 Users', 'Unlimited Integrations', 'Advanced Insights & Predictions', 'Priority Email Support', 'API Access'],
        ctaText: 'Upgrade to Pro',
        isFeatured: true,
      },
      {
        name: 'Enterprise',
        price: 'Contact Us',
        period: '',
        description: 'For large organizations with custom needs and support.',
        features: ['Unlimited Users', 'Dedicated Infrastructure', 'Custom Models & Integrations', '24/7 Premium Support', 'SLA Guarantee'],
        ctaText: 'Contact Sales',
        isFeatured: false,
      },
    ];

    return (
        <div className={`min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
             <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-[#111111] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <LandingHeader theme={theme} onThemeToggle={toggleTheme} onLoginClick={onLoginClick} />

            <main className="container mx-auto px-4 pt-32 pb-16">
                {/* Hero */}
                <section className="text-center max-w-4xl mx-auto mb-24">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500">
                            Deep Research at Your Fingertips
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8">
                        Meet DeerFlow, your personal Deep Research assistant. With powerful tools like search engines, web crawlers, Python and MCP services, it delivers instant insights, comprehensive reports, and even captivating podcasts.
                    </p>
                    <button onClick={onRegisterClick} className="bg-slate-800 dark:bg-white text-white dark:text-black font-semibold px-8 py-3 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors text-lg flex items-center mx-auto">
                        Get Started <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </section>

                {/* Case Studies */}
                <section className="mb-24">
                    <h2 className="text-4xl font-bold text-center mb-4">Case Studies</h2>
                    <p className="text-center text-slate-500 dark:text-slate-400 mb-8">See DeerFlow in action through replays.</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {caseStudies.map((study, index) => (
                            <GlassmorphicCard key={index}>
                                <div className="flex flex-col h-full">
                                    <study.icon className="w-8 h-8 mb-4 text-slate-500 dark:text-slate-400"/>
                                    <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{study.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm flex-grow">{study.description}</p>
                                </div>
                            </GlassmorphicCard>
                        ))}
                    </div>
                </section>
                
                {/* Multi-Agent Architecture */}
                <section className="text-center mb-24">
                    <h2 className="text-4xl font-bold mb-4">Multi-Agent Architecture</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">Experience the agent teamwork with our Supervisor + Handoffs design pattern.</p>
                    <GlassmorphicCard className="p-4 md:p-8">
                         {/* Static representation of the diagram */}
                        <div className="relative aspect-video flex justify-center items-center text-xs">
                            {/* This is a simplified representation. A real implementation might use SVG. */}
                            <div className="absolute top-0 text-center space-y-1">
                                <div>Start</div>
                                <div className="w-0.5 h-4 bg-slate-500 mx-auto"></div>
                                <div className="border border-slate-500 rounded px-2 py-1">Coordinator</div>
                            </div>
                            <div className="absolute top-1/4 w-full flex justify-center">
                                <div className="border border-slate-500 rounded px-2 py-1">Planner</div>
                            </div>
                             <div className="absolute" style={{top: '45%', left: '25%'}}>
                                <div className="border border-slate-500 rounded px-2 py-1">Human Feedback</div>
                            </div>
                             <div className="absolute" style={{top: '45%', right: '25%'}}>
                                <div className="border border-slate-500 rounded px-2 py-1">Reporter</div>
                            </div>
                            <div className="absolute" style={{top: '65%', left: '35%'}}>
                                <div className="border border-slate-500 rounded px-2 py-1">Research Team</div>
                            </div>
                             <div className="absolute bottom-1/4" style={{left: '20%'}}>
                                <div className="border border-slate-500 rounded px-2 py-1">Researcher</div>
                            </div>
                             <div className="absolute bottom-1/4" style={{right: '35%'}}>
                                <div className="border border-slate-500 rounded px-2 py-1">Coder</div>
                            </div>
                            <div className="absolute bottom-0 right-1/4 text-center">
                                <div className="border border-slate-500 rounded px-2 py-1">End</div>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between bg-slate-500/10 dark:bg-white/5 p-2 rounded-full border border-gray-500/20 dark:border-white/10">
                            <div className="flex items-center space-x-2">
                                <button className="p-1"><ArrowRight className="w-4 h-4 rotate-180" /></button>
                                <button className="p-1"><Pause className="w-4 h-4" /></button>
                                <button className="p-1"><ArrowRight className="w-4 h-4" /></button>
                            </div>
                            <div className="flex-1 mx-4 h-1 bg-slate-500/30 rounded-full">
                                <div className="w-1/2 h-full bg-slate-400 rounded-full"></div>
                            </div>
                            <button className="p-1"><Maximize2 className="w-4 h-4" /></button>
                        </div>
                    </GlassmorphicCard>
                </section>


                {/* Core Features */}
                <section className="mb-24">
                    <h2 className="text-4xl font-bold text-center mb-4">Core Features</h2>
                    <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Find out what makes DeerFlow effective.</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coreFeatures.map((feature, index) => (
                            <GlassmorphicCard key={index} className={index >= 3 ? "lg:col-span-1" : ""}>
                                <div className="flex flex-col h-full">
                                    <feature.icon className="w-8 h-8 mb-4 text-slate-500 dark:text-slate-400"/>
                                    <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm flex-grow">{feature.description}</p>
                                    {feature.learnMore && <a href="#" className="flex items-center text-sm font-semibold mt-4 text-blue-500 dark:text-blue-400">Learn more <ArrowRight className="w-4 h-4 ml-1" /></a>}
                                </div>
                            </GlassmorphicCard>
                        ))}
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="mb-24">
                    <h2 className="text-4xl font-bold text-center mb-4">Pricing Plans</h2>
                    <p className="text-center text-slate-500 dark:text-slate-400 mb-12">Choose the plan that's right for you.</p>
                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {pricingTiers.map((tier, index) => (
                            <GlassmorphicCard key={index} className={`flex flex-col ${tier.isFeatured ? 'border-violet-500/50 dark:border-violet-500/50' : ''}`}>
                                {tier.isFeatured && <div className="absolute -top-3 right-6 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
                                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{tier.name}</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">{tier.description}</p>
                                <div className="mb-6">
                                    <span className="text-5xl font-extrabold text-slate-900 dark:text-white">{tier.price}</span>
                                    <span className="text-slate-500 dark:text-slate-400">{tier.period}</span>
                                </div>
                                <ul className="space-y-4 mb-8 text-sm text-slate-700 dark:text-slate-300">
                                    {tier.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-center">
                                            <Check className="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={onRegisterClick} className={`w-full mt-auto font-semibold py-3 rounded-lg transition-colors ${tier.isFeatured ? 'bg-violet-500 text-white hover:bg-violet-600' : 'bg-slate-800 dark:bg-white text-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-200'}`}>
                                    {tier.ctaText}
                                </button>
                            </GlassmorphicCard>
                        ))}
                    </div>
                </section>

                {/* Community */}
                <section className="text-center">
                    <h2 className="text-4xl font-bold mb-4">
                        Join the <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">DeerFlow Community</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                        Contribute brilliant ideas to shape the future of DeerFlow. Collaborate, innovate, and make impacts.
                    </p>
                     <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="bg-slate-800 dark:bg-white text-white dark:text-black font-semibold px-6 py-3 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors inline-flex items-center">
                        <Github className="w-5 h-5 mr-2" />
                        Contribute Now
                    </a>
                </section>
            </main>
            <footer className="text-center text-xs text-slate-500 dark:text-slate-500 py-8 space-y-2">
                <p>"Originated from Open Source, give back to Open Source."</p>
                <p>Licensed under MIT License © 2025 DeerFlow</p>
            </footer>
        </div>
    );
};