import { getCourseById, getUserCourseStatus } from "@/app/actions/elearning";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PlayerUI from "./PlayerUI";

export const dynamic = "force-dynamic";

export default async function CoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  const course = await getCourseById(courseId);
  const status = await getUserCourseStatus(courseId);

  if (!course) {
    return <div className="p-10 text-center text-xl text-[#38050e]">Curso no encontrado.</div>;
  }

  if (!status || status.status !== "approved") {
    return <div className="p-10 text-center text-xl text-[#38050e]">No tienes acceso a este curso.</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4efe4]">
      <PlayerUI course={course} progress={status} />
    </div>
  );
}
