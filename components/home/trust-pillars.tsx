import { Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { t } from "@/lib/i18n";

const TRUST_PILLARS = [
  {
    icon: Leaf,
    title: t('home.trust.natural.title'),
    desc: t('home.trust.natural.desc'),
  },
  {
    icon: Sparkles,
    title: t('home.trust.crafted.title'),
    desc: t('home.trust.crafted.desc'),
  },
  {
    icon: ShieldCheck,
    title: t('home.trust.quality.title'),
    desc: t('home.trust.quality.desc'),
  },
  {
    icon: Truck,
    title: t('home.trust.shipping.title'),
    desc: t('home.trust.shipping.desc'),
  },
];

export function TrustPillars() {
  return (
    <section className="border-b border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {TRUST_PILLARS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold-light)]/30">
                <Icon className="h-5 w-5" style={{ color: "var(--gold)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed hidden md:block">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
