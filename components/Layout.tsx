import Navbar from './Navbar';
import Footer from './Footer';
import Head from 'next/head';
import { PageTransition } from './Motion';
import FloatingWhatsApp from './FloatingWhatsApp';
import GoToTop from './GoToTop';
// import ChatAgent from './ChatAgent';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout = ({ children, title, description }: LayoutProps) => {
  const defaultTitle = 'Organic Herbs Co — Premium Egyptian Herbs, Spices & Seeds Exporter';
  const defaultDescription = 'Leading Egyptian exporter of premium herbs, spices, seeds, dried flowers & botanical raw materials. HACCP certified. Serving 50+ countries worldwide.';

  return (
    <>
      <Head>
        <title>{title ? `${title} | Organic Herbs Co` : defaultTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col font-body-md bg-background text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        <Navbar />
        <main className="flex-grow">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <FloatingWhatsApp />
        <GoToTop />
        {/* <ChatAgent /> */}
      </div>
    </>
  );
};

export default Layout;
