import React from 'react';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { SesiLogo } from './SesiLogo';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 md:gap-0">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <SesiLogo className="h-20 w-20" size={80} />
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1 tracking-tight">SESI CAXIAS NEWS</h2>
              <p className="text-gray-400 italic text-sm mb-3">
                "Escola que informa, Alunos que crescem"
              </p>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <a
                  id="footer-email-contact-link"
                  href="mailto:sesicaxiasnews@hotmail.com"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold border border-neutral-700 transition-colors"
                  title="Dúvidas e Sugestões: sesicaxiasnews@hotmail.com"
                >
                  <Mail size={14} className="text-orange-400" />
                  <span>Dúvidas e Sugestões: <strong className="text-white">sesicaxiasnews@hotmail.com</strong></span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <a
              id="footer-social-facebook"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-800 rounded-full"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              id="footer-social-instagram"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-800 rounded-full"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              id="footer-social-twitter"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-800 rounded-full"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Sesi Caxias News. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
