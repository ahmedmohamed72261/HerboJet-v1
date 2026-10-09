import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { FadeIn, StaggerGrid, StaggerItem } from '@/components/Motion';
import ProductCard from '@/components/ProductCard';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api from '@/lib/api';
import { FiPackage, FiRefreshCw, FiSearch, FiFilter } from 'react-icons/fi';

interface Product {
  id: number | string;
  name_en: string;
  name_ar: string;
  short_description_en: string;
  short_description_ar: string;
  description_en: string;
  description_ar: string;
  image: string | null;
  category: {
    id: number | string;
    name_en: string;
    name_ar: string;
  };
}

interface Category {
  id: number | string;
  name_en: string;
  name_ar: string;
  slug: string;
  order?: number;
}

const Products = () => {
  const { language } = useAppStore();
  const router = useRouter();
  const t = translations[language];
  const page = t.productsPage;
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const cat = router.query.category as string;
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory(null);
    }
  }, [router.isReady, router.query.category]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const handleCategoryClick = useCallback((id: string | null) => {
    if (id) {
      router.push(`/products?category=${id}`, undefined, { shallow: true });
    } else {
      router.push('/products', undefined, { shallow: true });
    }
  }, [router]);

  const isCategoryActive = useCallback((cat: Category) => {
    if (!selectedCategory) return false;
    return cat.order?.toString() === selectedCategory || cat.id?.toString() === selectedCategory;
  }, [selectedCategory]);

  const normalizeItem = (item: any) => item ? { ...item, id: item.id ?? item._id } : null;

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      const data = response.data?.data || response.data || [];
      setCategories(Array.isArray(data) ? data.map(normalizeItem).filter(Boolean) : []);
    } catch (error) {
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(false);
    try {
      const params = selectedCategory ? { category_id: selectedCategory } : {};
      const response = await api.get('/products', { params });
      const data = response.data?.data || response.data || [];
      setProducts(Array.isArray(data) ? data.map(normalizeItem).filter(Boolean) : []);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={t.products.title}>
      <div className={`w-full min-h-screen bg-background ${language === 'ar' ? 'rtl' : ''}`}>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-black pt-32 pb-20 lg:pt-48 lg:pb-32">
          <img src="/images/breadcrumb.jpg" alt="Products" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          
          <FadeIn className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative z-10 text-center text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/10 text-white font-label-sm text-xs uppercase tracking-[0.2em] mb-6 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-sm bg-secondary-fixed"></span>
              {page.heroBadge}
            </div>
            <h1 className="font-headline-lg text-[40px] md:text-[56px] leading-[1.1] font-bold text-white tracking-tight mb-space-sm">
              {t.products.title}
            </h1>
            <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mx-auto leading-relaxed mt-4">
              {page.heroDescription}
            </p>
          </FadeIn>
        </section>

        {/* Products Catalog */}
        <section className="w-full py-space-xl lg:py-28">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <FiFilter className="text-lg" />
                </div>
                <span className="font-label-md text-sm text-on-surface font-bold uppercase tracking-widest">
                  {t.products.filterByCategory}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`px-6 py-2.5 rounded-full font-label-md text-xs uppercase tracking-widest transition-all duration-300 ${
                    !selectedCategory
                      ? 'bg-primary text-on-primary shadow-md scale-105'
                      : 'bg-surface-container-high text-on-surface hover:bg-outline-variant/20 hover:text-primary font-medium'
                  }`}
                >
                  {t.products.allCategories}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id.toString())}
                    className={`px-6 py-2.5 rounded-full font-label-md text-xs uppercase tracking-widest transition-all duration-300 ${
                      isCategoryActive(category)
                        ? 'bg-primary text-on-primary shadow-md scale-105'
                        : 'bg-surface-container-high text-on-surface hover:bg-outline-variant/20 hover:text-primary font-medium'
                    }`}
                  >
                    {language === 'en' ? category.name_en : category.name_ar}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 h-[460px] flex flex-col overflow-hidden">
                    <div className="h-64 bg-surface-container animate-pulse w-full" />
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="h-4 bg-surface-container rounded animate-pulse w-1/3 mb-6" />
                      <div className="h-6 bg-surface-container rounded animate-pulse w-3/4 mb-4" />
                      <div className="space-y-2 mb-8">
                        <div className="h-4 bg-surface-container rounded animate-pulse w-full" />
                        <div className="h-4 bg-surface-container rounded animate-pulse w-full" />
                        <div className="h-4 bg-surface-container rounded animate-pulse w-2/3" />
                      </div>
                      <div className="mt-auto pt-6 border-t border-outline-variant/20">
                        <div className="h-12 bg-surface-container rounded-xl animate-pulse w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-surface-container-lowest rounded-2xl max-w-lg mx-auto text-center p-space-xl border border-outline-variant/20 shadow-sm">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                  <FiPackage className="w-7 h-7" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{t.common.error}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
                  {language === 'en' ? 'Unable to load products. Please try again.' : 'تعذر تحميل المنتجات. يرجى المحاولة مرة أخرى.'}
                </p>
                <button onClick={fetchProducts} className="inline-flex items-center gap-2 px-space-lg py-3 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors">
                  <FiRefreshCw className="w-4 h-4" />
                  {language === 'en' ? 'Retry' : 'إعادة المحاولة'}
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl max-w-lg mx-auto text-center p-space-xl border border-outline-variant/20 shadow-sm">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-surface-container text-outline-variant flex items-center justify-center">
                  <FiSearch className="w-7 h-7" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{t.common.noData}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {language === 'en' ? 'No products found in this category.' : 'لم يتم العثور على منتجات في هذه الفئة.'}
                </p>
              </div>
            ) : (
              <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <StaggerItem key={product.id}>
                    <ProductCard
                      id={product.id}
                      name={language === 'en' ? product.name_en : product.name_ar}
                      category={language === 'en' ? product.category.name_en : product.category.name_ar}
                      description={language === 'en' ? product.short_description_en : product.short_description_ar}
                      image={product.image}
                      isFeatured={true}
                    />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            )}
            
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Products;