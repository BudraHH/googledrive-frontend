import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
                    <div className="col-span-2 lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                                <Cloud size={18} fill="currentColor" strokeWidth={2.5} />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-slate-900">CloudDrive</span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-6">
                            Secure, encrypted storage for teams who care about their data privacy.
                            Built for speed, reliability, and peace of mind.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink icon={<Github size={18} />} href="#" label="GitHub" />
                            <SocialLink icon={<Twitter size={18} />} href="#" label="Twitter" />
                            <SocialLink icon={<Linkedin size={18} />} href="#" label="LinkedIn" />
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <FooterLink>Features</FooterLink>
                            <FooterLink>Security</FooterLink>
                            <FooterLink>Pricing</FooterLink>
                            <FooterLink>Roadmap</FooterLink>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <FooterLink>About</FooterLink>
                            <FooterLink>Careers</FooterLink>
                            <FooterLink>Blog</FooterLink>
                            <FooterLink>Contact</FooterLink>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <FooterLink>Privacy</FooterLink>
                            <FooterLink>Terms</FooterLink>
                            <FooterLink>Cookie Policy</FooterLink>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500 font-medium">
                        © {currentYear} CloudDrive Inc. All rights reserved.
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        Made with <Heart size={10} className="text-red-500 fill-red-500" /> by BudraHH
                    </p>
                </div>
            </div>
        </footer>
    );
};

// Helper Components
const SocialLink = ({ icon, href, label }) => (
    <a
        href={href}
        aria-label={label}
        className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all duration-300"
    >
        {icon}
    </a>
);

const FooterLink = ({ children, to = "#" }) => (
    <li>
        <Link to={to} className="hover:text-brand-600 hover:translate-x-1 transition-all inline-block">
            {children}
        </Link>
    </li>
);

export default Footer;
