import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { ArchetypesPreview } from '../components/landing/ArchetypesPreview';
import { Pricing } from '../components/landing/Pricing';
import { CtaFinal } from '../components/landing/CtaFinal';
import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="landing-page">
      {/* Nav landing */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="sidebar-logo" style={{ fontSize: '1.5rem' }}>
            AXIOM
          </Link>
          <div className="landing-nav-links">
            <a href="#features" className="nav-link">Funcionalidades</a>
            <a href="#archetypes" className="nav-link">Arquétipos</a>
            <a href="#pricing" className="nav-link">Planos</a>
            <Link to="/checkout" className="btn-primary">
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      <Hero />

      <div id="features">
        <Features />
      </div>

      <div id="archetypes">
        <ArchetypesPreview />
      </div>

      <div id="pricing">
        <Pricing />
      </div>

      <CtaFinal />

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="sidebar-logo" style={{ fontSize: '1.25rem' }}>AXIOM</span>
          <p className="footer-text">© {new Date().getFullYear()} Axiom. Parte da família Synkra.</p>
        </div>
      </footer>
    </div>
  );
}
