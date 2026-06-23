import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 px-5 py-12 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 max-w-2xl">
          {eyebrow ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-2xl font-semibold tracking-normal text-white sm:text-3xl">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}
