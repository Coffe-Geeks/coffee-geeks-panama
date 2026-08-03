import { getCourseById } from "@/app/actions/elearning";
import CourseFormClient from "./CourseFormClient";

export const dynamic = "force-dynamic";

export default async function AdminCourseFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  
  let course = null;
  if (!isNew) {
    course = await getCourseById(id);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <CourseFormClient initialData={course} isNew={isNew} />
    </div>
  );
}
