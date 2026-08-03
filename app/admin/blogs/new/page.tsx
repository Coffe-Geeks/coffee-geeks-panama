import BlogForm from "@/app/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Crear Nuevo Post</h1>
        <p className="text-[#cddbf2]/60 font-medium">Comparte una nueva historia con la comunidad</p>
      </div>

      <BlogForm />
    </div>
  );
}
