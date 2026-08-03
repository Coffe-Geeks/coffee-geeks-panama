import BlogForm from "@/app/components/admin/BlogForm";
import { getBlogPostById } from "@/app/actions/blog";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Editar Post</h1>
        <p className="text-[#cddbf2]/60 font-medium">Modificando: <span className="text-white italic">{post.title}</span></p>
      </div>

      <BlogForm initialData={post} />
    </div>
  );
}
