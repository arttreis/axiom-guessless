import { Link } from 'react-router-dom';

export function CtaFinal() {
  return (
    <section className="cta-final-section">
      <div className="cta-final-content">
        <h2 className="cta-final-title">
          Pronto para descobrir a
          <br />
          <span className="text-gradient">identidade da sua marca?</span>
        </h2>
        <p className="cta-final-subtitle">
          Junte-se a marcas que comunicam com autenticidade e criam conteúdo que ressoa de verdade.
        </p>
        <Link to="/checkout" className="btn-primary btn-xl">
          Começar gratuitamente — 7 dias grátis →
        </Link>
        <p className="cta-final-note">
          Sem cartão de crédito · Cancele quando quiser · Setup em 5 minutos
        </p>
      </div>
    </section>
  );
}
