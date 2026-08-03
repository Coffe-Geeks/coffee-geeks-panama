import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { getCourseById, getUserCourseStatus } from "@/app/actions/elearning";
import { getSession } from "@/lib/session";
import ActionButtons from "./ActionButtons";

export const dynamic = "force-dynamic";

export default async function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = await getCourseById(courseId);
  const session = await getSession();
  const status = await getUserCourseStatus(courseId);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4efe4]">
        <h1 className="text-2xl font-bold text-[#38050e]">Curso no encontrado</h1>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500;700&display=swap');
        .main-bg { background: #f4efe4; }
        .hero-banner { position: relative; padding-top: 58px; background: #38050e; }
        .hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0.3; }
        .hero-gradient { position: absolute; inset: 0; background: linear-gradient(to top, #38050e, transparent); }
      `}</style>
      <Navbar />

      <div className="hero-banner">
        <div className="hero-bg" style={{ backgroundImage: `url('${course.mainImage}')` }}></div>
        <div className="hero-gradient"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 lg:py-32 flex flex-col items-center text-center">
          <span className="font-['Barlow'] text-sm font-bold tracking-widest text-[#cddbf2]/80 uppercase mb-4">Detalles del Curso</span>
          <h1 className="font-['Barlow_Condensed'] text-5xl lg:text-7xl font-bold text-white uppercase leading-tight max-w-4xl">
            {course.title}
          </h1>
        </div>
      </div>

      <main className="main-bg py-16">
        <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-[2fr_1fr] gap-12">
          
          <div className="space-y-12">
            <section className="bg-white p-8 lg:p-10 rounded-3xl shadow-sm border border-[#38050e]/5">
              <h2 className="font-['Barlow_Condensed'] text-3xl font-bold text-[#22191A] uppercase mb-4">Acerca de este curso</h2>
              <div className="font-['Barlow'] text-[#524345] leading-relaxed space-y-4 text-lg">
                {course.description.split('\n').map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-['Barlow_Condensed'] text-3xl font-bold text-[#22191A] uppercase mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#38050e] text-white flex items-center justify-center text-lg">
                  {course.lessons?.length || 0}
                </span>
                Lecciones del Curso
              </h2>
              <div className="space-y-4">
                {course.lessons?.sort((a: any, b: any) => a.order - b.order).map((lesson: any, i: number) => (
                  <div key={lesson._id} className="bg-white p-5 rounded-2xl shadow-sm border border-[#38050e]/5 flex gap-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#f4efe4] rounded-full flex items-center justify-center font-bold text-[#38050e]">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-['Barlow'] font-bold text-lg text-[#22191A] mb-1">{lesson.title}</h3>
                      <p className="font-['Barlow'] text-[#857375] text-sm">{lesson.description}</p>
                      {lesson.duration && (
                        <div className="mt-3 inline-block px-3 py-1 bg-[#f4efe4] text-[#524345] text-xs font-bold rounded-lg">
                          ⏱ {lesson.duration}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#38050e]/5 text-center">
              <div className="mb-6">
                <h3 className="font-['Barlow_Condensed'] text-2xl font-bold text-[#22191A] uppercase">
                  Acceso al Curso
                </h3>
                <p className="font-['Barlow'] text-[#857375] text-sm mt-2">
                  Completa este curso a tu propio ritmo. El progreso quedará guardado.
                </p>
              </div>
              
              <ActionButtons 
                courseId={course._id.toString()} 
                isLoggedIn={!!session} 
                status={status?.status} 
              />
              
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
