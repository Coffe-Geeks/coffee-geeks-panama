import { getBlogPostBySlug } from "@/app/actions/blog";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.isPublished) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fcfbf9]">
        <style>{`
          .post-header { background: #38050e; padding: 140px 0 100px; color: #fff; position: relative; overflow: hidden; }
          .post-header-wrap { width: 100%; max-width: 900px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 2; }
          .post-meta { font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; opacity: 0.6; margin-bottom: 20px; display: block; }
          .post-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(32px, 6vw, 64px); font-weight: 900; text-transform: uppercase; line-height: 0.9; margin-bottom: 30px; }
          
          .post-content-sec { padding: 80px 0; }
          .post-content-wrap { width: 100%; max-width: 800px; margin: 0 auto; padding: 0 25px; }
          
          .post-main-img { width: 100%; aspect-ratio: 16/9; position: relative; border-radius: 30px; overflow: hidden; margin-top: -120px; box-shadow: 0 30px 60px rgba(0,0,0,0.2); z-index: 10; margin-bottom: 60px; }
          
          .post-body { font-family: 'Barlow', sans-serif; font-size: 1.15rem; line-height: 1.8; color: #333; }
          .post-body h2 { font-family: 'Barlow Condensed', sans-serif; font-size: 2.5rem; font-weight: 900; text-transform: uppercase; margin: 1.5em 0 0.8em; color: #38050e; }
          .post-body h3 { font-family: 'Barlow Condensed', sans-serif; font-size: 1.8rem; font-weight: 800; text-transform: uppercase; margin: 1.2em 0 0.6em; color: #38050e; }
          .post-body p { margin-bottom: 1.5em; opacity: 0.9; }
          .post-body img { max-width: 100%; height: auto; border-radius: 20px; margin: 40px 0; display: block; }
          .post-body blockquote { border-left: 5px solid #38050e; padding-left: 30px; font-style: italic; font-size: 1.4rem; margin: 40px 0; color: #555; }
          
          .share-sec { margin-top: 80px; padding-top: 40px; border-top: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between; }
          .back-btn { font-family: 'Barlow', sans-serif; font-weight: 800; text-transform: uppercase; color: #38050e; text-decoration: none; display: flex; align-items: center; gap: 10px; font-size: 14px; }
        `}</style>

        <section className="post-header">
          <div className="post-header-wrap">
            <span className="post-meta">Publicado el {new Date(post.createdAt).toLocaleDateString('es-PA', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            <h1 className="post-title">{post.title}</h1>
          </div>
        </section>

        <section className="post-content-sec">
          <div className="post-content-wrap">
            {post.mainImage && (
              <div className="post-main-img">
                <Image src={post.mainImage} alt={post.title} fill className="object-cover" priority />
              </div>
            )}
            
            <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            <div className="share-sec">
              <a href="/blogs" className="back-btn">← Volver al blog</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
