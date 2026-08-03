import { getBlogPosts } from "@/app/actions/blog";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function BlogListPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sParams = await searchParams;
  const page = parseInt(sParams.page || "1");
  const { posts, totalPages } = await getBlogPosts(page, 12);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <style>{`
          .blogs-hero { background: #38050e; padding: 120px 0 80px; text-align: center; color: #fff; }
          .blogs-hero h1 { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(40px, 8vw, 80px); font-weight: 900; text-transform: uppercase; line-height: 0.85; margin-bottom: 20px; }
          .blogs-hero p { font-family: 'Barlow', sans-serif; font-size: 1.2rem; opacity: 0.7; max-width: 600px; margin: 0 auto; }
          
          .blogs-grid-sec { padding: 80px 0; }
          .blogs-wrap { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 20px; }
          .blogs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
          
          .bc { background: #f4efe4; border-radius: 20px; overflow: hidden; transition: all 0.3s; border: 1px solid rgba(56,5,14,0.05); }
          .bc:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
          .bc-img { width: 100%; height: 200px; background-size: cover; background-position: center; }
          .bc-body { padding: 25px; }
          .bc-date { font-family: 'Barlow', sans-serif; font-size: 12px; color: #38050e; opacity: 0.5; margin-bottom: 10px; font-weight: 600; text-transform: uppercase; }
          .bc-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.6rem; font-weight: 900; text-transform: uppercase; color: #38050e; line-height: 1.1; margin-bottom: 12px; }
          .bc-exc { font-family: 'Barlow', sans-serif; font-size: 15px; color: #38050e; opacity: 0.8; line-height: 1.6; margin-bottom: 20px; }
          .bc-link { font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 800; color: #38050e; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; }
          
          .pagination { display: flex; justify-content: center; gap: 10px; margin-top: 60px; }
          .pg-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 1px solid #cddbf2; color: #38050e; text-decoration: none; font-weight: 800; transition: all 0.2s; }
          .pg-btn.active { background: #38050e; color: #fff; border-color: #38050e; }
          .pg-btn:hover:not(.active) { background: #f4efe4; }
        `}</style>

        <section className="blogs-hero">
          <div className="blogs-wrap">
            <h1>Historias <br/> del Grano</h1>
            <p>Descubre artículos, guías y entrevistas sobre la cultura del café en Panamá.</p>
          </div>
        </section>

        <section className="blogs-grid-sec">
          <div className="blogs-wrap">
            <div className="blogs-grid">
              {posts.map((post: any) => (
                <Link href={`/blog/${post.slug}`} key={post._id} className="bc" style={{ textDecoration: 'none' }}>
                  <div className="bc-img" style={{ backgroundImage: `url(${post.mainImage})` }} />
                  <div className="bc-body">
                    <div className="bc-date">{new Date(post.createdAt).toLocaleDateString('es-PA', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    <h2 className="bc-title">{post.title}</h2>
                    <p className="bc-exc">{post.shortDescription}</p>
                    <span className="bc-link">Leer más →</span>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Link 
                    key={i} 
                    href={`/blogs?page=${i + 1}`} 
                    className={`pg-btn ${page === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
