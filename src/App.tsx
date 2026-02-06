import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

// Product data
const products = [
  {
    id: 0,
    name: 'Orange Puffer',
    price: '$59.99',
    image: '/jacket-orange.png',
    bgClass: 'bg-gradient-orange',
    colors: { primary: '#E85D3F', secondary: '#F4A261' }
  },
  {
    id: 1,
    name: 'Olive Puffer',
    price: '$59.99',
    image: '/jacket-olive.png',
    bgClass: 'bg-gradient-olive',
    colors: { primary: '#6B5B3D', secondary: '#8B7355' }
  },
  {
    id: 2,
    name: 'Purple Puffer',
    price: '$59.99',
    image: '/jacket-purple.png',
    bgClass: 'bg-gradient-purple',
    colors: { primary: '#9B8FBF', secondary: '#C4B5E0' }
  }
];

// Nike Swoosh SVG Component
const NikeSwoosh = () => (
  <svg 
    width="50" 
    height="20" 
    viewBox="0 0 69 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="nike-swoosh"
  >
    <path 
      d="M68.75 2.5C59.75 8.5 42.5 18.5 28.75 18.5C15 18.5 5 12.5 0 0C10 8.75 25 15 40 15C52.5 15 62.5 8.75 68.75 2.5Z" 
      fill="white"
    />
  </svg>
);

// User Icon Component
const UserIcon = () => (
  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="white" 
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  </div>
);

// Navigation Component
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center justify-between px-6 lg:px-12 transition-all duration-500 ${scrolled ? 'bg-black/20 backdrop-blur-md' : ''}`}>
      {/* Left - User */}
      <div className="flex items-center gap-3">
        <UserIcon />
        <span className="text-white text-xs font-medium opacity-90">ui/ux rusty</span>
      </div>

      {/* Center - Logo */}
      <div className="logo-container absolute left-1/2 transform -translate-x-1/2">
        <div className="bg-black/30 px-5 py-2 rounded-lg">
          <span className="text-white text-sm font-bold tracking-wide">RGX</span>
        </div>
      </div>

      {/* Right - Nav Links */}
      <div className="flex items-center gap-6">
        {['TUTORIAL', 'HOME', 'SALE', 'SIGN UP'].map((link) => (
          <a
            key={link}
            href="#"
            className="nav-link text-white text-[11px] font-medium tracking-wide uppercase"
          >
            {link}
          </a>
        ))}
      </div>
    </nav>
  );
};

// Color Selector Component
interface ColorSelectorProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

const ColorSelector = ({ activeIndex, onSelect }: ColorSelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      {products.map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`color-dot-large ${activeIndex === index ? 'active' : ''}`}
          aria-label={`Select ${products[index].name}`}
        />
      ))}
    </div>
  );
};

// Main App Component
function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [bgGradient, setBgGradient] = useState(products[0].bgClass);
  const [scrollY, setScrollY] = useState(0);
  const [imageAnimation, setImageAnimation] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleColorSelect = useCallback((index: number) => {
    if (index !== activeIndex) {
      // Animate out
      setImageAnimation('animate-scale-out');
      
      setTimeout(() => {
        setActiveIndex(index);
        // Animate in
        setImageAnimation('animate-scale-in');
        
        setTimeout(() => {
          setImageAnimation('');
        }, 600);
      }, 300);
    }
  }, [activeIndex]);

  // Update background gradient when active index changes
  useEffect(() => {
    setBgGradient(products[activeIndex].bgClass);
  }, [activeIndex]);

  // Scroll handler for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate products
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % products.length;
      setImageAnimation('animate-scale-out');
      
      setTimeout(() => {
        setActiveIndex(nextIndex);
        setImageAnimation('animate-scale-in');
        
        setTimeout(() => {
          setImageAnimation('');
        }, 600);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const product = products[activeIndex];
  const parallaxOffset = scrollY * 0.3;
  const contentOpacity = Math.max(0, 1 - scrollY / 400);
  const jacketScale = 1 + scrollY * 0.0005;

  return (
    <div 
      ref={containerRef}
      className={`min-h-[200vh] w-full bg-transition ${bgGradient} relative`}
    >
      {/* Navigation */}
      <Navigation />

      {/* Hero Section - Full Screen Jacket */}
      <section className="h-screen w-full relative overflow-hidden flex items-center justify-center">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
          
          {/* Floating orbs with parallax */}
          <div 
            className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl transition-all duration-1000"
            style={{
              background: `radial-gradient(circle, ${product.colors.secondary}50 0%, transparent 70%)`,
              top: `${10 + parallaxOffset * 0.05}%`,
              left: '5%',
              transform: `translateY(${-parallaxOffset * 0.2}px)`
            }}
          />
          <div 
            className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-3xl transition-all duration-1000"
            style={{
              background: `radial-gradient(circle, ${product.colors.primary}50 0%, transparent 70%)`,
              bottom: `${5 - parallaxOffset * 0.03}%`,
              right: '5%',
              transform: `translateY(${parallaxOffset * 0.15}px)`
            }}
          />
        </div>

        {/* Full Screen Jacket Image */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translateY(${-parallaxOffset}px) scale(${jacketScale})`,
            transition: 'transform 0.1s linear'
          }}
        >
          <img
            key={product.id}
            src={product.image}
            alt={product.name}
            className={`w-[90vw] max-w-[1400px] h-auto object-contain ${imageAnimation}`}
            style={{ 
              filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.4))',
              willChange: 'transform, opacity'
            }}
          />
        </div>

        {/* Top Left - Nike Logo */}
        <div 
          className="absolute top-24 left-8 lg:left-16 z-20"
          style={{ opacity: contentOpacity }}
        >
          <NikeSwoosh />
        </div>

        {/* Right Side - Color Selector */}
        <div 
          className="absolute right-8 lg:right-16 top-1/2 transform -translate-y-1/2 z-20"
          style={{ opacity: contentOpacity }}
        >
          <ColorSelector activeIndex={activeIndex} onSelect={handleColorSelect} />
        </div>

        {/* Bottom Left - Title & Price */}
        <div 
          className="absolute bottom-24 left-8 lg:left-16 z-20"
          style={{ 
            opacity: contentOpacity,
            transform: `translateY(${-parallaxOffset * 0.3}px)`
          }}
        >
          <h1 className="text-white text-4xl lg:text-6xl font-bold leading-tight mb-4">
            Wear your<br />Style with<br />Comfort
          </h1>
          <div className="flex items-center gap-6">
            <span className="text-white text-3xl lg:text-4xl font-semibold">{product.price}</span>
            <button className="glass-button px-6 py-3 rounded-full text-white text-sm font-semibold">
              Add to Cart
            </button>
          </div>
        </div>

        {/* Bottom Center - Pagination Dots */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2"
          style={{ opacity: contentOpacity }}
        >
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => handleColorSelect(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Bottom Right - Attribution */}
        <div 
          className="absolute bottom-8 right-8 lg:right-16 z-20"
          style={{ opacity: contentOpacity }}
        >
          <span className="text-white/50 text-xs">ui/ux rusty</span>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center"
          style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Second Section - Product Details */}
      <section className="min-h-screen w-full relative flex items-center justify-center px-8 lg:px-16 py-24">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Product Info */}
          <div className="text-white">
            <h2 className="text-5xl lg:text-7xl font-bold mb-6">
              {product.name}
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Experience ultimate comfort with our premium puffer jacket. 
              Designed for style and warmth, this jacket features high-quality 
              down insulation and a water-resistant outer shell.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">Premium Materials</h4>
                  <p className="text-white/60 text-sm">High-quality down insulation</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">Water Resistant</h4>
                  <p className="text-white/60 text-sm">Protection from the elements</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">Lightweight</h4>
                  <p className="text-white/60 text-sm">Comfortable all-day wear</p>
                </div>
              </div>
            </div>

            <button className="glass-button px-8 py-4 rounded-full text-white font-semibold text-lg">
              Shop Now - {product.price}
            </button>
          </div>

          {/* Right - Large Product Image */}
          <div className="relative">
            <div 
              className="absolute inset-0 rounded-3xl opacity-30 blur-3xl"
              style={{ background: `linear-gradient(135deg, ${product.colors.primary}40 0%, ${product.colors.secondary}40 100%)` }}
            />
            <img
              src={product.image}
              alt={product.name}
              className="relative w-full h-auto object-contain animate-float"
              style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.3))' }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-8 lg:px-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-2">RGX</h3>
            <p className="text-white/60 text-sm">Wear your Style with Comfort</p>
          </div>
          
          <div className="flex gap-8">
            {['About', 'Contact', 'Privacy', 'Terms'].map((link) => (
              <a key={link} href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                {link}
              </a>
            ))}
          </div>
          
          <div className="text-white/40 text-xs">
            © 2026 RGX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
