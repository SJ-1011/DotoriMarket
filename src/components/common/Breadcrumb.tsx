import Link from 'next/link';

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb text-xs lg:text-sm text-gray-400">
      {items.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <Link href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 && <span className="mx-2">{'>'}</span>}
        </span>
      ))}
    </nav>
  );
}
