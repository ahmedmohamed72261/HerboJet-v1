import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { FadeIn, StaggerGrid, StaggerItem } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api, { getAssetUrl } from '@/lib/api';
import { FiArrowLeft, FiCheckCircle, FiShield, FiTruck, FiMapPin, FiLayers, FiDroplet, FiAward, FiCloud, FiArchive, FiClock, FiSend } from 'react-icons/fi';
import { GetStaticProps, GetStaticPaths } from 'next';

interface Product {
  id: number;
  name_en: string;
  name_ar: string;
  short_description_en: string;
  short_description_ar: string;
  description_en: string;
  description_ar: string;
  image: string | null;
  images: string[] | null;
  category: {
    id: number;
    name_en: string;
    name_ar: string;
  };
  price?: number | string;
  sku?: string;
  stock?: number;
  is_featured?: boolean;
  origin?: string;
  form?: string;
  color?: string;
  purity?: string;
  moisture?: string;
  packaging?: string;
  shelf_life?: string;
  certifications?: string[];
  export_availability?: string;
}

interface ProductDetailsProps {
  product: Product | null;
  suggestedProducts: Product[];
}

const specIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  origin: FiMapPin,
  form: FiLayers,
  color: FiDroplet,
  purity: FiAward,
  moisture: FiCloud,
  packaging: FiArchive,
  shelf_life: FiClock,
  export_availability: FiSend,
};

const ProductDetails = ({ product, suggestedProducts }: ProductDetailsProps) => {
  const router = useRouter();
  const { language } = useAppStore();
  const t = translations[language];

  const [selectedImage, setSelectedImage] = useState<string | null>(product?.image || null);

  interface ProductSpec {
    label: string;
    key: string;
  }

  const specFields: ProductSpec[] = [
    { label: language === 'en' ? 'Origin' : 'بلد المنشأ', key: 'origin' },
    { label: language === 'en' ? 'Form' : 'الشكل', key: 'form' },
    { label: language === 'en' ? 'Color' : 'اللون', key: 'color' },
    { label: language === 'en' ? 'Purity' : 'النقاء', key: 'purity' },
    { label: language === 'en' ? 'Moisture' : 'الرطوبة', key: 'moisture' },
    { label: language === 'en' ? 'Packaging' : 'التغليف', key: 'packaging' },
    { label: language === 'en' ? 'Shelf Life' : 'مدة الصلاحية', key: 'shelf_life' },
    { label: language === 'en' ? 'Export Availability' : 'التوفر للتصدير', key: 'export_availability' },
  ];

  if (!product) {
    return (
      <Layout title={t.products.title}>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
          <span className="text-6xl mb-4 opacity-50">😔</span>
          <p className="font-headline-sm text-xl font-bold text-on-surface-variant mb-6">{t.common.noData}</p>
          <button
            onClick={() => router.push('/products')}
            className="flex items-center gap-2 px-6 py-3 bg-primary-container hover:bg-primary text-on-primary font-label-lg rounded-lg transition-colors shadow-sm"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Products
          </button>
        </div>
      </Layout>
    );
  }

  const productName = language === 'en' ? product.name_en : product.name_ar;
  const productDesc = language === 'en' ? product.description_en : product.description_ar;
  const categoryName = language === 'en' ? product.category?.name_en : product.category?.name_ar;
  const price = Number(product.price);
  const hasPrice = price > 0;

  return (
    <Layout title={productName}>
      <div className={`w-full min-h-screen bg-background pt-24 ${language === 'ar' ? 'rtl' : ''}`}>
        
        {/* Breadcrumb */}
        <div className="bg-surface border-b border-outline-variant/30 sticky top-[72px] z-40 shadow-sm">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            <div className="flex items-center gap-2 py-4 font-label-sm text-[13px] overflow-x-auto whitespace-nowrap scrollbar-hide">
              <button onClick={() => router.push('/')} className="text-on-surface-variant hover:text-primary transition-colors font-semibold">
                {language === 'en' ? 'Home' : 'الرئيسية'}
              </button>
              <span className="text-outline-variant">/</span>
              <button onClick={() => router.push('/products')} className="text-on-surface-variant hover:text-primary transition-colors font-semibold">
                {language === 'en' ? 'Products' : 'المنتجات'}
              </button>
              <span className="text-outline-variant">/</span>
              <span className="text-primary font-bold truncate max-w-[200px]">{productName}</span>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <section className="py-12 lg:py-20 bg-background">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-2xl mb-24 items-start">
              
              {/* Image Section */}
              <FadeIn className="lg:col-span-5 lg:sticky lg:top-36">
                {/* Main Image */}
                <div className="relative rounded-3xl overflow-hidden bg-surface-container aspect-square flex items-center justify-center group shadow-md border border-outline-variant/20">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent z-10 pointer-events-none" />
                  {selectedImage ? (
                    <img
                      src={getAssetUrl(selectedImage)}
                      alt={productName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-container-highest">
                      <div className="text-center">
                        <FiAward className="w-20 h-20 text-outline-variant/40 mx-auto mb-4" />
                        <span className="font-label-md text-lg text-outline-variant font-medium">{productName}</span>
                      </div>
                    </div>
                  )}
                  {product.is_featured && (
                    <div className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 bg-surface-container-lowest/90 backdrop-blur-sm text-secondary px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm border border-secondary/20 uppercase tracking-widest">
                      <span>★</span>
                      <span>{language === 'en' ? 'Featured' : 'مميز'}</span>
                    </div>
                  )}
                </div>

                {/* Gallery Thumbnails */}
                {product.images && product.images.length > 0 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                      onClick={() => setSelectedImage(product.image)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        selectedImage === product.image
                          ? 'border-primary ring-2 ring-primary/20 shadow-sm'
                          : 'border-outline-variant/30 hover:border-primary/50'
                      }`}
                    >
                      {product.image ? (
                        <img
                          src={getAssetUrl(product.image)}
                          alt="Main"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-container flex items-center justify-center">
                          <FiAward className="text-outline-variant/40 w-8 h-8" />
                        </div>
                      )}
                    </button>
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                          selectedImage === img
                            ? 'border-primary ring-2 ring-primary/20 shadow-sm'
                            : 'border-outline-variant/30 hover:border-primary/50'
                        }`}
                      >
                        <img
                          src={getAssetUrl(img)}
                          alt={`Gallery ${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Trust Badges */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
                    <FiShield className="w-5 h-5 text-secondary" />
                    <span className="font-label-sm text-[10px] font-bold text-primary uppercase tracking-wider text-center leading-tight">
                      {language === 'en' ? 'Premium Quality' : 'جودة عالية'}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
                    <FiCheckCircle className="w-5 h-5 text-secondary" />
                    <span className="font-label-sm text-[10px] font-bold text-primary uppercase tracking-wider text-center leading-tight">
                      {language === 'en' ? 'Certified' : 'معتمد'}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
                    <FiTruck className="w-5 h-5 text-secondary" />
                    <span className="font-label-sm text-[10px] font-bold text-primary uppercase tracking-wider text-center leading-tight">
                      {language === 'en' ? 'Worldwide Ship' : 'شحن عالمي'}
                    </span>
                  </div>
                </div>
              </FadeIn>

              {/* Details Section */}
              <FadeIn className="lg:col-span-7 flex flex-col pt-4 lg:pt-0">
                {/* Category & Badge */}
                <div className="mb-4 flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 font-label-sm text-[12px] font-bold text-secondary bg-secondary/10 px-3.5 py-1.5 rounded-lg uppercase tracking-widest">
                    {categoryName}
                  </span>
                  {hasPrice && (
                    <span className="inline-flex items-center font-headline-sm text-2xl font-bold text-primary">
                      ${price.toFixed(2)}
                      <span className="ml-1.5 font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                        / {language === 'en' ? 'kg' : 'كجم'}
                      </span>
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="font-headline-lg text-4xl lg:text-[56px] font-bold text-primary mb-6 leading-tight tracking-tight">
                  {productName}
                </h1>

                {/* Short Description */}
                <p className="font-body-lg text-lg text-on-surface-variant mb-10 leading-relaxed border-l-4 border-secondary/30 pl-4 py-1 italic">
                  &ldquo;{language === 'en' ? product.short_description_en : product.short_description_ar}&rdquo;
                </p>

                {/* Full Description */}
                <div className="mb-12">
                  <h3 className="font-headline-sm text-[22px] font-bold text-primary mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    {language === 'en' ? 'About this product' : 'عن هذا المنتج'}
                  </h3>
                  <p className="font-body-md text-base text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                    {productDesc}
                  </p>
                </div>

                {/* Product Specifications */}
                <div className="mb-12">
                  <h3 className="font-headline-sm text-[22px] font-bold text-primary mb-5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    {language === 'en' ? 'Specifications' : 'المواصفات'}
                  </h3>
                  <div className="rounded-2xl border border-outline-variant/30 divide-y divide-outline-variant/20 bg-surface-container-lowest shadow-sm overflow-hidden">
                    {specFields.map((field) => {
                      const value = (product as any)[field.key];
                      if (!value || (Array.isArray(value) && value.length === 0)) return null;
                      return (
                        <div key={field.key} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-surface-container-low transition-colors gap-2 sm:gap-4">
                          <span className="font-label-md text-[14px] font-bold text-on-surface-variant flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/10">
                              {(() => {
                                const Icon = specIcons[field.key];
                                return Icon ? <Icon className="w-4 h-4 text-secondary" /> : null;
                              })()}
                            </span>
                            {field.label}
                          </span>
                          <span className="font-body-md text-[15px] font-medium text-primary sm:text-right">
                            {value}
                          </span>
                        </div>
                      );
                    })}
                    {product.certifications && product.certifications.length > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-surface-container-low transition-colors gap-3 sm:gap-4">
                        <span className="font-label-md text-[14px] font-bold text-on-surface-variant flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/10">
                            <FiCheckCircle className="w-4 h-4 text-secondary" />
                          </span>
                          {language === 'en' ? 'Certifications' : 'الشهادات'}
                        </span>
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                          {product.certifications.map((cert: string, i: number) => (
                            <span key={i} className="inline-flex items-center px-3 py-1 bg-surface-container text-primary font-label-sm text-[12px] font-bold rounded-md border border-outline-variant/20 shadow-sm uppercase tracking-wider">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="sticky bottom-4 z-30 pt-4 bg-background/80 backdrop-blur-md pb-4 lg:static lg:bg-transparent lg:p-0">
                  <a
                    href={(() => {
                      const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201102737769';
                      const msg = language === 'en'
                        ? `Hello! I'm interested in ${productName}.%0A%0AProduct Details:%0A- Category: ${categoryName}%0A${hasPrice ? `- Price: $${price.toFixed(2)}/kg%0A` : ''}${product.origin ? `- Origin: ${product.origin}%0A` : ''}${product.form ? `- Form: ${product.form}%0A` : ''}${product.certifications?.length ? `- Certifications: ${product.certifications.join(', ')}` : ''}%0A%0ACould you please provide more details and pricing?`
                        : `مرحباً، أنا مهتم بـ ${productName}.%0A%0Aتفاصيل المنتج:%0A- التصنيف: ${categoryName}%0A${hasPrice ? `- السعر: $${price.toFixed(2)}/كجم%0A` : ''}${product.origin ? `- بلد المنشأ: ${product.origin}%0A` : ''}${product.form ? `- الشكل: ${product.form}%0A` : ''}${product.certifications?.length ? `- الشهادات: ${product.certifications.join(', ')}` : ''}%0A%0Aهل يمكنكم تزويدي بمزيد من التفاصيل والأسعار؟`;
                      return `https://wa.me/${phone}?text=${msg}`;
                    })()}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 px-6 bg-primary-container hover:bg-primary text-on-primary font-label-lg text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.01] shadow-md hover:shadow-lg flex items-center justify-center gap-3 border border-primary/20"
                  >
                    <FiTruck className="w-5 h-5" />
                    <span>{language === 'en' ? 'Request a Quote via WhatsApp' : 'طلب عرض سعر عبر واتساب'}</span>
                  </a>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Suggested Products Section */}
        {suggestedProducts.length > 0 && (
          <section className="py-20 lg:py-28 bg-surface-container-low border-t border-outline-variant/20">
            <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
              <FadeIn>
                <div className="text-center mb-14">
                  <span className="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-[0.2em] bg-secondary/10 px-3 py-1.5 rounded-lg inline-block mb-3">
                    {language === 'en' ? 'You might also like' : 'قد يعجبك أيضاً'}
                  </span>
                  <h2 className="font-headline-lg text-3xl lg:text-[44px] font-bold text-primary tracking-tight">
                    {language === 'en' ? 'Related Products' : 'منتجات ذات صلة'}
                  </h2>
                  <p className="font-body-md text-on-surface-variant text-base mt-3 max-w-lg mx-auto">
                    {language === 'en'
                      ? `Explore more products in the ${categoryName} category`
                      : `استكشف المزيد من المنتجات في فئة ${categoryName}`}
                  </p>
                </div>

                <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter lg:gap-space-lg">
                  {suggestedProducts.map((prod) => (
                    <StaggerItem key={prod.id}>
                      <ProductCard
                        id={prod.id}
                        name={language === 'en' ? prod.name_en : prod.name_ar}
                        category={language === 'en' ? prod.category?.name_en : prod.category?.name_ar}
                        description={language === 'en' ? prod.short_description_en : prod.short_description_ar}
                        image={prod.image}
                        isFeatured={prod.is_featured}
                      />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </FadeIn>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await api.get('/products?limit=1000');
    const products = response.data?.data || response.data || [];
    
    const paths = products.map((product: Product) => ({
      params: { id: product.id.toString() },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching products for static paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<ProductDetailsProps> = async ({ params }) => {
  try {
    const productId = params?.id;
    
    // Fetch main product
    const productResponse = await api.get(`/products/${productId}`);
    const product = productResponse.data?.data || productResponse.data;

    if (!product) {
      return { notFound: true };
    }

    // Fetch suggested products from same category
    let suggestedProducts: Product[] = [];
    if (product.category?.id) {
      try {
        const suggestedResponse = await api.get('/products', {
          params: { category_id: product.category.id || (product.category as any)._id },
        });
        const allSuggested = suggestedResponse.data?.data || suggestedResponse.data || [];
        suggestedProducts = allSuggested.filter((p: Product) => p.id !== product.id).slice(0, 3);
      } catch (error) {
        console.error('Error fetching suggested products:', error);
      }
    }

    // Ensure price is a number
    if (product.price) {
      product.price = Number(product.price);
    }

    return {
      props: {
        product,
        suggestedProducts,
      },
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
};

export default ProductDetails;
