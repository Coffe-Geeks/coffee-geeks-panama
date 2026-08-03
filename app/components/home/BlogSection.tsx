import { getBlogPosts } from "@/app/actions/blog";
import Link from "next/link";

export default async function BlogSection() {
  const { posts } = await getBlogPosts(1, 3);
  
  if (posts.length === 0) return null;

  return (
    <>
      <style>{`
        .blog-sec { background: #FFFFFF; padding: 80px 0; }
        .blog-wrap { width: 100%; max-width: 1160px; margin: 0 auto; padding: 0 clamp(20px,5vw,60px); }
        .blog-hd { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 32px; flex-wrap: wrap; }
        .eyebrow-bl { display: flex; align-items: center; gap: 9px; margin-bottom: 6px; }
        .eyebrow-line-bl { width: 24px; height: 2px; background: #38050e; flex-shrink: 0; }
        .eyebrow-text-bl { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: #38050e; }
        .blog-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(28px,4vw,42px); font-weight: 900; text-transform: uppercase; color: #38050e; line-height: .92; margin-top: 6px; }
        .btn-out-bl {
          display: inline-flex; align-items: center; height: 40px; padding: 0 24px;
          border-radius: 50px; border: 1px solid #cddbf2; background: transparent;
          color: #38050e; font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all .2s; text-decoration: none;
        }
        .btn-out-bl:hover { background: #38050e; color: #fff; border-color: #38050e; }
        .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .bc { background: #f4efe4; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,.12), 0 1px 3px 1px rgba(0,0,0,.08); transition: box-shadow .25s, transform .25s; cursor: pointer; border: 1px solid rgba(56,5,14,.05); }
        .bc:hover { box-shadow: 0 4px 8px 3px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.12); transform: translateY(-5px); }
        .bc-img { width: 100%; height: 160px; display: flex; align-items: flex-start; padding: 12px; }
        .bc-chip { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .04em; background: rgba(255,255,255,.18); color: #fff; padding: 4px 9px; border-radius: 50px; border: 1px solid rgba(255,255,255,.2); }
        .bc-body { padding: 14px 15px 12px; }
        .bc-date { font-family: 'Barlow', sans-serif; font-size: 12px; color: #38050e; opacity: .5; margin-bottom: 5px; }
        .bc-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.2rem; font-weight: 900; text-transform: uppercase; color: #38050e; line-height: 1.15; margin-bottom: 6px; }
        .bc-exc { font-family: 'Barlow', sans-serif; font-size: 13.5px; color: #38050e; opacity: .7; line-height: 1.55; margin-bottom: 10px; }
        .bc-more { font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 500; color: #38050e; text-decoration: none; transition: all .2s; }
        .bc-more:hover { color: #56050e; text-decoration: underline; }
        @media (max-width: 960px) { .blog-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 640px) { .blog-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section className="blog-sec">
        <div className="blog-wrap">
          <div className="blog-hd">
            <div>
              <div className="eyebrow-bl">
                <div className="eyebrow-line-bl" />
                <span className="eyebrow-text-bl">Historias</span>
              </div>
              <h2 className="blog-title">Más allá<br />de la taza</h2>
            </div>
            <Link href="/blog" className="btn-out-bl">Ver todo el blog →</Link>
          </div>

          <div className="blog-grid">
            {posts.map((post: any) => (
              <div className="bc" key={post._id}>
                <div className="bc-img" style={{ backgroundImage: `url(${post.mainImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <span className="bc-chip">Blog</span>
                </div>
                <div className="bc-body">
                  <div className="bc-date">{new Date(post.createdAt).toLocaleDateString('es-PA', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  <div className="bc-title">{post.title}</div>
                  <div className="bc-exc">{post.shortDescription}</div>
                  <Link href={`/blog/${post.slug}`} className="bc-more">Leer más →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
