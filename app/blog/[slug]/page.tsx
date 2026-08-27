import { getBlogPostBySlug } from "@/app/actions/blog";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.isPublished) {
    notFound();
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        .ph{position:relative;padding-top:58px;background:linear-gradient(135deg,#4a0a15 0%,#38050e 55%,#24060c 100%)}
        .ph-sc{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.62) 0%,rgba(0,0,0,.48) 45%,rgba(0,0,0,.72) 100%)}
        .ph-cnt{position:relative;z-index:2;padding:44px 0 44px}
        .ph-flex{display:flex;align-items:center;justify-content:space-between;gap:40px}
        .ph-txt{flex:1}
        .ph-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(196,212,232,.7);margin-bottom:10px}
        .ph-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(38px,6vw,64px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.92;margin-bottom:4px}

        .bread{background:#fff;border-bottom:1px solid #eee}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px}
        .bread-i a{color:#38050e;opacity:.7;transition:opacity .2s;text-decoration:none}
        .bread-i a:hover{opacity:1}
        .bread-i span{color:#38050e;opacity:.6}

        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}

        /* ── Detail Page Layout ── */
        .main-sec{background:#fff;padding:56px 0 72px}
        .post-layout{max-width:800px;margin:0 auto}
        
        .img-container{width:100%;aspect-ratio:16/9;border-radius:24px;overflow:hidden;border:1px solid #cddbf2;background:#f4efe4;box-shadow:0 8px 30px rgba(56,5,14,0.06);margin-bottom:40px;position:relative}
        
        /* Rich Text Content */
        .rich-content{font-family:'Barlow',sans-serif;font-size:16px;line-height:1.75;color:#38050e;opacity:.9}
        .rich-content img {
          max-width: 100%;
          height: auto;
          border-radius: 16px;
          margin: 28px 0;
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
        }
        .rich-content h2{font-family:'Barlow Condensed',sans-serif;font-size:2.2rem;font-weight:900;text-transform:uppercase;margin:36px 0 18px;color:#38050e;line-height:1.1}
        .rich-content h3{font-family:'Barlow Condensed',sans-serif;font-size:1.6rem;font-weight:900;text-transform:uppercase;margin:28px 0 14px;color:#38050e;line-height:1.1}
        .rich-content p{margin-bottom:20px}
        .rich-content ul{list-style-type:disc;padding-left:20px;margin-bottom:20px}
        .rich-content ol{list-style-type:decimal;padding-left:20px;margin-bottom:20px}
        .rich-content blockquote { border-left: 4px solid #38050e; padding-left: 24px; font-style: italic; font-size: 1.25rem; margin: 32px 0; color: rgba(56,5,14,0.85); font-family: 'Barlow', sans-serif; }

        .back-box{margin-top:56px;padding-top:32px;border-top:1px solid #eef3f9}
        .back-btn{display:inline-flex;align-items:center;gap:7px;font-family:'Barlow',sans-serif;font-size:14px;font-weight:700;color:#38050e;text-decoration:none;text-transform:uppercase;transition:opacity .2s}
        .back-btn:hover{opacity:.6}
      `}</style>

      <Navbar />

      {/* Hero */}
      <div className="ph">
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-flex">
              <div className="ph-txt">
                <div className="ph-eye">
                  Publicado el {new Date(post.createdAt).toLocaleDateString('es-PA', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
                <h1 className="ph-h1">{post.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/">Inicio</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <Link href="/blogs">Blog</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span>{post.title}</span>
          </div>
        </div>
      </div>

      {/* Main Post Section */}
      <section className="main-sec">
        <div className="wrap">
          <div className="post-layout">
            {post.mainImage && (
              <div className="img-container">
                <Image 
                  src={post.mainImage} 
                  alt={post.title} 
                  fill 
                  className="object-cover" 
                  priority 
                />
              </div>
            )}

            <div 
              className="rich-content" 
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />

            <div className="back-box">
              <Link href="/blogs" className="back-btn">
                ← Volver al blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
