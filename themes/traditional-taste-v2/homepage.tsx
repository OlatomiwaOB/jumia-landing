import HeroPromoGrid from './components/ui/hero-promo-grid';

export default function Homepage() {
    return (
        <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text)] transition-colors duration-300 font-sans">
            <HeroPromoGrid />
        </div>
    );
}
