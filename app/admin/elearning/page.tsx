import Link from "next/link";
import { getCourses } from "@/app/actions/elearning";
import DeleteCourseButton from "./DeleteCourseButton";

export const dynamic = "force-dynamic";

export default async function AdminElearningPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#cddbf2]">Academia (E-learning)</h1>
          <p className="text-[#cddbf2]/70 mt-1">Administra los cursos y módulos de aprendizaje.</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/elearning/requests"
            className="px-4 py-2 bg-[#cddbf2]/10 border border-[#cddbf2]/20 text-[#cddbf2] rounded-xl hover:bg-[#cddbf2]/20 transition-all font-medium"
          >
            Ver Solicitudes
          </Link>
          <Link
            href="/admin/elearning/course-form/new"
            className="px-4 py-2 bg-[#cddbf2] text-[#0f0505] rounded-xl hover:bg-white transition-all font-medium"
          >
            + Nuevo Curso
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course: any) => (
          <div key={course._id} className="bg-white/5 border border-[#cddbf2]/10 rounded-2xl overflow-hidden hover:border-[#cddbf2]/30 transition-all">
            <div className="h-48 relative">
              {course.mainImage ? (
                <img src={course.mainImage} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#cddbf2]/10 flex items-center justify-center">
                  <span className="text-[#cddbf2]/50 text-sm">Sin imagen</span>
                </div>
              )}
              {!course.isActive && (
                <div className="absolute top-2 right-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full font-bold">
                  Inactivo
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-[#cddbf2] mb-2">{course.title}</h3>
              <p className="text-[#cddbf2]/70 text-sm line-clamp-2 mb-4">{course.description}</p>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#cddbf2]/50">{course.lessons?.length || 0} lecciones</span>
                
                <div className="flex gap-3">
                  <Link href={`/admin/elearning/course-form/${course._id}`} className="text-[#cddbf2]/80 hover:text-white transition-colors">
                    Editar
                  </Link>
                  <DeleteCourseButton courseId={course._id.toString()} />
                </div>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-[#cddbf2]/20 rounded-2xl">
            <p className="text-[#cddbf2]/60">No hay cursos creados aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
