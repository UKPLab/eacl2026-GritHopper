"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Github } from "lucide-react";

const authors = [
  { name: "Justus-Jonas Erker", affiliation: "1", url: "https://erker.ai" },
  { name: "Nils Reimers", affiliation: "2", url: "https://nils-reimers.de" },
  { name: "Iryna Gurevych", affiliation: "1", url: "https://www.informatik.tu-darmstadt.de/ukp/ukp_home/head_ukp/index.en.jsp" },
];

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center px-4 pt-8 pb-12 relative overflow-hidden bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto text-center"
      >
        {/* Venue badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-block mb-6"
        >
          <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
            EACL 2026 Main Conference
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900"
        >
          GRITHopper
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-8"
        >
          Decomposition-Free Multi-Hop Dense Retrieval
        </motion.h2>

        {/* GritHopper mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <Image
            src="/logos/grithopper-logo.jpeg"
            alt="GritHopper Mascot"
            width={200}
            height={200}
            className="mx-auto rounded-2xl shadow-lg"
          />
        </motion.div>

        {/* Authors */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-lg">
            {authors.map((author, idx) => (
              <span key={author.name} className="flex items-baseline">
                <a
                  href={author.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 font-medium hover:text-blue-600 hover:underline transition-colors"
                >
                  {author.name}
                </a>
                <sup className="text-blue-600 text-xs ml-0.5 font-medium">{author.affiliation}</sup>
                {idx < authors.length - 1 && (
                  <span className="text-gray-300 ml-6">,</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Institution logos with affiliations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-12 md:gap-16 mb-10"
        >
          {/* UKP Lab & TU Darmstadt */}
          <div className="flex items-center gap-3">
            <sup className="text-blue-600 text-sm font-medium">1</sup>
            <div className="flex items-center gap-3">
              <Image
                src="/logos/ukp-logo.png"
                alt="UKP Lab"
                width={180}
                height={60}
                className="h-14 w-auto"
              />
              <span className="text-gray-700 font-medium text-xl">UKP Lab · TU Darmstadt</span>
            </div>
          </div>

          {/* Cohere */}
          <div className="flex items-center gap-3">
            <sup className="text-blue-600 text-sm font-medium">2</sup>
            <Image
              src="/logos/cohere-full.svg"
              alt="Cohere"
              width={360}
              height={100}
              className="h-36 w-auto"
            />
          </div>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {/* HuggingFace Model */}
          <a
            href="https://huggingface.co/UKPLab/GritHopper-7B"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
          >
            <Image
              src="/logos/hf-logo.png"
              alt="HuggingFace"
              width={24}
              height={24}
              className="w-5 h-5"
            />
            <span className="font-medium text-gray-700">GritHopper-7B</span>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/UKPLab/GritHopper"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
          >
            <Github className="w-5 h-5 text-gray-700" />
            <span className="font-medium text-gray-700">Code</span>
          </a>

          {/* arXiv PDF with arXiv logo */}
          <a
            href="https://arxiv.org/pdf/2503.07519.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="2" fill="#B31B1B"/>
              <text x="4" y="15" fontSize="7" fill="white" fontFamily="Arial" fontWeight="bold">arXiv</text>
            </svg>
            <span className="font-medium text-gray-700">2503.07519</span>
          </a>

          {/* PyPI - pip install grithopper */}
          <a
            href="https://pypi.org/project/grithopper/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3775A9">
              <path d="M9.585 11.692h4.328s2.432.039 2.432-2.35V5.391S16.714 3 11.936 3C7.362 3 7.647 4.983 7.647 4.983l.006 2.055h4.363v.617H5.92s-2.927-.332-2.927 4.282 2.555 4.45 2.555 4.45h1.524v-2.141s-.083-2.554 2.513-2.554zm-.056-5.74a.784.784 0 110-1.57.784.784 0 110 1.57z"/>
              <path d="M14.415 12.308h-4.328s-2.432-.039-2.432 2.35v3.951s-.369 2.391 4.409 2.391c4.573 0 4.288-1.983 4.288-1.983l-.006-2.055h-4.363v-.617h6.097s2.927.332 2.927-4.282-2.555-4.45-2.555-4.45h-1.524v2.141s.083 2.554-2.513 2.554zm.056 5.74a.784.784 0 110 1.57.784.784 0 110-1.57z"/>
            </svg>
            <span className="font-medium text-gray-700">pip install grithopper</span>
          </a>

          {/* BibTeX Copy Button */}
          <button
            onClick={() => {
              const bibtex = `@inproceedings{erker2026grithopper,
  title={{GRITHopper}: Decomposition-Free Multi-Hop Dense Retrieval},
  author={Erker, Justus-Jonas and Reimers, Nils and Gurevych, Iryna},
  booktitle={Proceedings of the 2026 Conference of the European Chapter of the Association for Computational Linguistics (EACL)},
  year={2026},
  url={https://arxiv.org/abs/2503.07519}
}`;
              navigator.clipboard.writeText(bibtex);
              const btn = document.getElementById('header-bibtex-btn');
              if (btn) {
                const span = btn.querySelector('span');
                if (span) {
                  span.textContent = 'Copied!';
                  setTimeout(() => { span.textContent = 'Copy BibTeX'; }, 2000);
                }
              }
            }}
            id="header-bibtex-btn"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span className="font-medium text-amber-700">Copy BibTeX</span>
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-gray-400"
          >
            <span className="text-sm mb-2">Scroll to see how it works</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </header>
  );
}
