import { FC } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiAward } from 'react-icons/fi';
import { getAssetUrl } from '@/lib/api';
import { useAppStore } from '@/store';

interface ProductCardProps {
  id: number | string;
  name: string;
  category: string;
  description: string;
  image: string | null;
  isFeatured?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  category,
  description,
  image,
  isFeatured = false,
}) => {
  const { language } = useAppStore();
  const viewDetailsLabel = language === 'en' ? 'View Specifications' : 'عرض المواصفات';

  return (
    <Link href={`/products/${id}`} className="h-full block">
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden flex flex-col h-full group border border-outline-variant/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl shadow-sm">
        <div className="relative h-64 bg-surface-container overflow-hidden">
          {image ? (
            <img
              src={getAssetUrl(image)}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <FiAward className="h-16 w-16 text-outline-variant/50 group-hover:text-primary transition-colors duration-300" />
            </div>
          )}
          {isFeatured && (
            <span className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1.5 rounded-lg text-[11px] uppercase font-bold tracking-widest shadow-md">
              {language === 'en' ? 'Current Harvest' : 'محصول حالي'}
            </span>
          )}
          <span className="absolute top-4 right-4 bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-lg text-[11px] uppercase font-bold tracking-widest shadow-md backdrop-blur-md">
            MOQ: 500 KG
          </span>
        </div>
        <div className="p-6 md:p-8 flex flex-col flex-grow relative">
          <div className="absolute top-0 right-8 w-16 h-16 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full">
              {category}
            </span>
          </div>
          <h3 className="font-headline-sm text-2xl font-bold text-on-surface mb-3 transition-colors group-hover:text-primary leading-tight">
            {name}
          </h3>
          <p className="font-body-md text-base text-on-surface-variant line-clamp-3 mb-8 flex-grow leading-relaxed">
            {description}
          </p>
          
          <div className="mt-auto pt-6 border-t border-outline-variant/20 flex items-center gap-3">
            <div className="flex-1 py-3.5 px-4 rounded-xl bg-surface-container-high text-on-surface font-bold text-sm text-center group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
              {viewDetailsLabel}
              <FiArrowRight className={`text-lg transition-transform group-hover:translate-x-1 ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;