import { ImageUpload } from './components/ImageUpload';
import { ImageGallery } from './components/ImageGallery';

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">PixelPrompt</h1>
                <p className="text-sm text-gray-400">AI-Powered Image Asset Manager</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-sm text-gray-300">Powered by OpenAI Vision</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
            <span className="text-white">Transform Images with</span>
            <br />
            <span className="gradient-text">Intelligent AI Analysis</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Upload your images and let AI generate titles, captions, and SEO tags instantly. 
            Perfect for content creators, marketers, and developers.
          </p>
        </div>

        {/* Upload Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <ImageUpload />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <ImageGallery />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 glass border-t border-white/5 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm text-gray-400">
                Powered by <span className="text-white font-medium">AWS Lambda</span>, <span className="text-white font-medium">DynamoDB</span>, <span className="text-white font-medium">S3</span> & <span className="text-white font-medium">OpenAI Vision</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-xs text-gray-500">Built with ❤️ for the cloud</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
