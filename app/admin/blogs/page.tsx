import Link from "next/link";
import { getBlogPosts, deleteBlogPost } from "@/app/actions/blog";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const { posts } = await getBlogPosts(1, 100, false); // Fetch all for admin

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Blog</h1>
          <p className="text-[#cddbf2]/60 font-medium">Gestiona las historias y noticias del sitio</p>
        </div>
        <Link 
          href="/admin/blogs/new" 
          className="bg-[#cddbf2] text-[#38050e] px-6 py-3 rounded-xl font-black uppercase tracking-wider hover:scale-105 transition-all flex items-center gap-2"
        >
          <span>➕</span> Nuevo Post
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {posts.length === 0 ? (
          <div className="bg-black/20 p-20 rounded-3xl border border-dashed border-[#cddbf2]/10 text-center">
            <p className="opacity-50 font-bold uppercase tracking-widest">No hay posts publicados aún</p>
          </div>
        ) : (
          posts.map((post: any) => (
            <div 
              key={post._id} 
              className="bg-black/40 border border-[#cddbf2]/10 p-4 rounded-2xl flex items-center gap-6 group hover:border-[#cddbf2]/30 transition-all"
            >
              <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-black/50 flex-shrink-0">
                {post.mainImage && <Image src={post.mainImage} alt={post.title} fill className="object-cover" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-white truncate">{post.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${post.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {post.isPublished ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
                <div className="text-xs opacity-50 flex items-center gap-3">
                  <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>🔗 /{post.slug}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link 
                  href={`/admin/blogs/${post._id}/edit`}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#cddbf2]/10 hover:bg-[#cddbf2]/20 transition-colors"
                  title="Editar"
                >
                  ✏️
                </Link>
                <form action={async () => {
                  "use server";
                  await deleteBlogPost(post._id);
                }}>
                  <button 
                    type="submit"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
