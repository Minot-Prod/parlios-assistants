import React from "react";

interface ParliosHeaderProps {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

export const ParliosHeader: React.FC<ParliosHeaderProps> = ({
  title,
  subtitle,
  rightSlot,
}) => {
  return (
    <div className="relative w-full overflow-hidden rounded-parlios-xl bg-parlios-wave-01 bg-cover bg-center shadow-parlios-strong border border-white/10">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="relative flex items-end justify-between p-6 md:p-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-parlios-text drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm md:text-base text-parlios-textMuted max-w-xl">
              {subtitle}
            </p>
          )}
        </div>
        {rightSlot && (
          <div className="flex-shrink-0 flex items-center gap-2">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
};
