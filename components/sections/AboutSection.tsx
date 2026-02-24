'use client';

interface Props {
  description: string | null | undefined;
  companyName?: string;
}

export default function AboutSection({ description, companyName }: Props) {
  if (!description) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        About {companyName || ''}
      </h2>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
