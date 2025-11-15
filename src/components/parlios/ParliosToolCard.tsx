import React from "react";

interface ParliosToolCardProps {
  title: string;
  description?: string;
  badge?: string;
  onClick?: () => void;
}

export const ParliosToolCard: React.FC<ParliosToolCardProps> = ({
  title,
  description,
  badge,
  onClick,
}) => {
  const Comp: any = onClick ? "button" : "div";

  return (
    <Comp
      onClick={onClick}
      className={`
        relative w-full overflow-hidden rounded-parlios-lg 
        bg-parlios-module-01 bg-cover bg-center
        border border-white/10
        shadow-parlios-soft
        text-left
        transition-transform transition-shadow duration-150
        hover:-translate-y-0.5 hover:shadow-parlios-accent
        focus:outline-none focus:ring-2 focus:ring-parlios-accent/60
        px-4 py-4 md:px-5 md:py-5
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/20 to-transparent" />
      <div className="relative flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base md:text-lg font-semibold text-parlios-text">
            {title}
          </h3>
          {badge && (
            <span className="inline-flex items-center rounded-full border border-parlios-accent/50 bg-black/40 px-2 py-0.5 text-[11px] uppercase tracking-wide text-parlios-accent">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs md:text-sm text-parlios-textMuted">
            {description}
          </p>
        )}
      </div>
    </Comp>
  );
};
