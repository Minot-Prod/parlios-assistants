import React from "react";

interface ParliosSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const ParliosSection: React.FC<ParliosSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <section className="relative w-full rounded-parlios-xl border border-white/8 bg-parlios-bgAlt/80 overflow-hidden shadow-parlios-soft">
      <div className="absolute inset-0 bg-parlios-pattern-01 bg-cover bg-center opacity-25 pointer-events-none" />
      <div className="absolute -top-20 -right-24 w-64 h-64 bg-parlios-accent/20 blur-3xl rounded-full pointer-events-none" />
      <div className="relative p-5 md:p-7 flex flex-col gap-4">
        {(title || description) && (
          <header>
            {title && (
              <h2 className="text-lg md:text-xl font-semibold text-parlios-text">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-parlios-textMuted max-w-2xl">
                {description}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
};
