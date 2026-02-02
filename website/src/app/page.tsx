import Header from "@/components/Header/Header";
import AnimationSection from "@/components/Animation/AnimationSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Paper Header */}
      <Header />

      {/* Interactive Animation Section */}
      <AnimationSection />

      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-600 mb-2">
            GRITHopper: Decomposition-Free Multi-Hop Dense Retrieval
          </p>
          <p className="text-xs text-gray-500">
            EACL 2026 Main Conference · UKP Lab, TU Darmstadt & Cohere
          </p>
          <div className="mt-5 flex justify-center gap-6 text-sm">
            <a
              href="https://huggingface.co/UKPLab/GritHopper-7B"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              HuggingFace
            </a>
            <a
              href="https://github.com/UKPLab/GritHopper"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://arxiv.org/abs/2503.07519"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-red-600 transition-colors"
            >
              arXiv
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
