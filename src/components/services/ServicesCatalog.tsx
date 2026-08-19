import { Card, Button } from "@heroui/react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ThreeDCard from "@/components/ThreeDCard";

type Plan = {
  name: string;
  description: string;
  note: string;
  features: string[];
  buttonText: string;
  href: string;
  featured?: boolean;
};

type MiniJob = { name: string; desc: string };

/** One package = one card. The single "recommended" tier per ladder is raised
 * and ringed; everything else stays quiet. Cards describe scope only — what a
 * package covers — and the figure is settled in conversation. */
function PlanCard({ plan, badge }: { plan: Plan; badge?: string }) {
  return (
    <div
      className={`relative flex h-full flex-col ${
        plan.featured ? "lg:-translate-y-2" : ""
      }`}
    >
      {plan.featured && badge && (
        <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-3.5 py-1 text-[11px] font-medium tracking-wide text-background shadow-md">
          {badge}
        </div>
      )}
      <ThreeDCard>
        <Card
          className={`relative flex w-full flex-1 flex-col overflow-hidden p-6 sm:p-7 ${
            plan.featured
              ? "bg-secondary shadow-xl ring-2 ring-foreground/80"
              : ""
          }`}
        >
          <div className="mb-5 flex flex-col items-start gap-2 border-b border-border pb-5">
            <h3 className="font-serif text-xl text-foreground">{plan.name}</h3>
            <p className="text-sm leading-relaxed text-muted sm:min-h-16">
              {plan.description}
            </p>
            {plan.note && (
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {plan.note}
              </p>
            )}
          </div>

          <ul className="flex flex-1 flex-col gap-3">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <Check
                  size={18}
                  className={
                    plan.featured
                      ? "mt-0.5 shrink-0 text-foreground"
                      : "mt-0.5 shrink-0 text-muted"
                  }
                />
                <span className="text-sm leading-relaxed text-foreground/80">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Link href={plan.href} className="block">
              <Button
                variant={plan.featured ? "primary" : "outline"}
                size="lg"
                className="w-full font-medium"
              >
                {plan.buttonText}
              </Button>
            </Link>
          </div>
        </Card>
      </ThreeDCard>
    </div>
  );
}

/** Left-aligned band intro, used to label each tier group inside a panel. */
function BandHeading({
  label,
  heading,
  sub,
}: {
  label: string;
  heading: string;
  sub: string;
}) {
  return (
    <div className="flex max-w-2xl flex-col">
      <span className="text-xs uppercase tracking-[0.22em] text-muted">
        {label}
      </span>
      <h3 className="mt-2 font-serif text-2xl text-foreground sm:text-3xl">
        {heading}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
        {sub}
      </p>
    </div>
  );
}

export default function ServicesCatalog() {
  const t = useTranslations("services");

  const plan = (key: string, featured = false): Plan => ({
    name: t(`plans.${key}.name`),
    description: t(`plans.${key}.description`),
    note: t(`plans.${key}.note`),
    features: t.raw(`plans.${key}.features`) as string[],
    buttonText: t(`plans.${key}.buttonText`),
    href: `/contact`,
    featured,
  });

  const landing = plan("landing");
  const website = plan("website", true);
  const dynamic = plan("dynamic");
  const optimize = plan("optimize");

  const student = t.raw("student") as Plan[];
  // student order: 0 fix, 1 CV, 2 HTML, 3 PHP, 4 React
  const coursework = [
    student[2],
    student[3],
    { ...student[4], featured: true },
  ];
  const studentExtra = [student[1], student[0]];

  const mini = t.raw("mini") as MiniJob[];
  const badge = t("featuredBadge");

  return (
    // One continuous list instead of an audience switch. The tabs hid half the
    // offering behind a click and made the visitor classify themselves before
    // they could see anything — the band headings already say who each group
    // is for, and the anchors (#build, #fix, #student) now always resolve.
    <div className="flex flex-col gap-16 sm:gap-20">
      <section id="build" className="scroll-mt-24">
        <BandHeading
          label={t("buildLabel")}
          heading={t("buildHeading")}
          sub={t("buildSub")}
        />

        <div className="mt-8 grid items-stretch gap-5 sm:gap-6 lg:grid-cols-3">
          <PlanCard plan={landing} />
          <PlanCard plan={website} badge={badge} />
          <PlanCard plan={dynamic} />
        </div>
      </section>

      <section id="fix" className="scroll-mt-24">
        <BandHeading
          label={t("fixLabel")}
          heading={t("fixHeading")}
          sub={t("fixSub")}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <PlanCard plan={optimize} />
          </div>

          <div className="lg:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
              {mini.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-border p-4 transition-colors hover:border-foreground/30"
                >
                  <p className="font-medium leading-snug text-foreground">
                    {item.name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm text-muted">{t("miniNote")}</p>
          </div>
        </div>
      </section>

      <section id="student" className="scroll-mt-24">
        <BandHeading
          label={t("studentLabel")}
          heading={t("studentHeading")}
          sub={t("studentSub")}
        />

        <div className="mt-8 grid items-stretch gap-5 sm:gap-6 lg:grid-cols-3">
          {coursework.map((p) => (
            <PlanCard key={p.name} plan={p} badge={badge} />
          ))}
        </div>

        <div className="mt-5 grid items-stretch gap-5 sm:mt-6 sm:gap-6 sm:grid-cols-2">
          {studentExtra.map((p) => (
            <PlanCard key={p.name} plan={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
