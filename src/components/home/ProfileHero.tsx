import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getAllProjects } from "@/services/projects.service";
import Headline from "@/components/ui/Headline";
import Aura from "@/components/ui/Aura";

const STAGGER = 110;

/**
 * Who this is, SaaS-style: eyebrow pill, centred headline with the name on
 * the pink highlighter, two actions, three numbers, and a product shot — the
 * featured project in a browser window, with the next two peeking out behind
 * it. The headline is plain server text, the LCP element from first paint.
 */
export default async function ProfileHero() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("profile");
  const facts = t.raw("facts") as { value: string; label: string }[];
  const projects = getAllProjects(locale).filter((p) => p.image[0]).slice(0, 3);
  const [main, ...side] = projects;
  const delay = (step: number) => ({ animationDelay: `${step * STAGGER}ms` });

  return (
    <section data-anchor="hero" className="relative isolate overflow-hidden px-5 sm:px-8">
      <Aura className="h-[52rem]" />

      <div className="mx-auto flex max-w-4xl flex-col items-center pt-16 text-center sm:pt-24">
        <p className="animate-rise" style={delay(0)}>
          <span className="eyebrow" data-pop="">
            {t("kicker")}
          </span>
        </p>

        <Headline
          className="headline-hero mt-6 text-foreground"
          segments={[{ text: t("headlineLead") }, { text: t("headlineAccent"), accent: true }]}
        />

        <p className="animate-rise lede mt-6 max-w-2xl" style={delay(2)}>
          {t("lede")}
        </p>

        <div className="animate-rise mt-9 flex flex-col items-center gap-3 sm:flex-row" style={delay(3)}>
          <Link href="/cv" className="btn-primary">
            <FileText className="h-4 w-4" aria-hidden />
            {t("ctaCv")}
          </Link>
          <a href="#contact" className="btn-secondary">
            {t("ctaContact")}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <dl className="animate-rise mt-12 grid w-full max-w-3xl grid-cols-3 divide-x divide-border" style={delay(4)}>
          {facts.map((fact) => (
            // Label first in the markup (dt before dd), value on top visually.
            <div key={fact.label} className="flex flex-col-reverse justify-end px-3 sm:px-6">
              <dt className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">{fact.label}</dt>
              <dd className="text-2xl font-bold tracking-tight text-hue-blue sm:text-4xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {main && (
        <div className="animate-rise relative mx-auto mt-16 max-w-5xl pb-20 sm:mt-20 sm:pb-28" style={delay(5)}>
          {/* The next two projects peek out behind the main window (lg+). */}
          {side.map((p, i) => (
            <Link
              key={p.id}
              href={`/library/projects/${p.id}`}
              tabIndex={-1}
              aria-hidden
              className={
                "card absolute top-10 hidden w-[38%] overflow-hidden p-1.5 transition-transform duration-300 hover:-translate-y-2 lg:block " +
                (i === 0 ? "-left-16 -rotate-6" : "-right-16 rotate-6")
              }
            >
              <span className="relative block aspect-16/10 overflow-hidden rounded-xl bg-band">
                <Image src={p.image[0].src} alt="" fill sizes="30vw" className="object-cover object-top" />
              </span>
            </Link>
          ))}

          <Link
            href={`/library/projects/${main.id}`}
            className="card card-link group relative block overflow-hidden p-0"
          >
            <span className="flex items-center gap-4 border-b border-border px-4 py-3">
              <span className="window-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <span className="mx-auto truncate rounded-md bg-band px-4 py-1 text-xs text-muted-foreground">
                {main.title} · {main.tagline}
              </span>
            </span>
            <span className="relative block aspect-16/9 bg-band">
              <Image
                src={main.image[0].src}
                alt={main.image[0].alt || main.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 64rem"
                className="object-cover object-top"
              />
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
