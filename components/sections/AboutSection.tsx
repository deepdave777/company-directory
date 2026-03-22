'use client';

interface Props {
  description: string | null | undefined;
  companyName?: string;
}

export default function AboutSection({ description, companyName }: Props) {
  if (!description) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 bg-[#ff4f12]"></span>
        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900">About {companyName}</h2>
      </div>
      <div className="bg-white border border-[#7d7373] p-5 sm:p-6">
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{description}</p>
      </div>
    </div>
  );
}
