"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";
import CourseRequest from "@/models/CourseRequest";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/upload";
import { getSession } from "@/lib/session";

// -- Cursos (Admin) --

export async function getCourses() {
  await dbConnect();
  const courses = await Course.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(courses));
}

export async function getCourseById(id: string) {
  await dbConnect();
  const course = await Course.findById(id).lean();
  return JSON.parse(JSON.stringify(course));
}

export async function createCourse(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("No autorizado");

  await dbConnect();
  
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const mainImageFile = formData.get("mainImage") as File;
  const isActive = formData.get("isActive") === "true";

  let mainImage = "";
  if (mainImageFile && mainImageFile.size > 0) {
    mainImage = await saveUploadedFile(mainImageFile, "courses");
  }

  const course = await Course.create({
    title,
    description,
    mainImage,
    isActive,
    lessons: []
  });

  revalidatePath("/admin/elearning");
  revalidatePath("/academia");
  return JSON.parse(JSON.stringify(course));
}

export async function updateCourse(id: string, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("No autorizado");

  await dbConnect();
  
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const isActive = formData.get("isActive") === "true";
  
  const updateData: any = { title, description, isActive };

  const mainImageFile = formData.get("mainImage") as File;
  if (mainImageFile && mainImageFile.size > 0) {
    updateData.mainImage = await saveUploadedFile(mainImageFile, "courses");
  }

  await Course.findByIdAndUpdate(id, updateData);
  revalidatePath("/admin/elearning");
  revalidatePath("/academia");
  revalidatePath(`/academia/${id}`);
}

export async function deleteCourse(id: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("No autorizado");

  await dbConnect();
  const course = await Course.findById(id);
  if (course) {
    if (course.mainImage) {
      await deleteUploadedFile(course.mainImage);
    }
    for (const lesson of course.lessons) {
      if (lesson.isVideoUploaded && lesson.videoUrl) {
         await deleteUploadedFile(lesson.videoUrl);
      }
    }
    await Course.findByIdAndDelete(id);
    await CourseRequest.deleteMany({ course: id });
  }

  revalidatePath("/admin/elearning");
  revalidatePath("/academia");
}

// -- Lecciones (Admin) --

export async function addOrUpdateLesson(courseId: string, formData: FormData, lessonId?: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("No autorizado");

  await dbConnect();
  
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Curso no encontrado");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const order = Number(formData.get("order")) || 0;
  const duration = formData.get("duration") as string;
  const isVideoUploaded = formData.get("isVideoUploaded") === "true";
  
  let videoUrl = formData.get("videoUrl") as string;
  const videoFile = formData.get("videoFile") as File;

  if (isVideoUploaded && videoFile && videoFile.size > 0) {
    videoUrl = await saveUploadedFile(videoFile, "courses/videos");
  }

  if (lessonId) {
    const lesson = course.lessons.id(lessonId);
    if (lesson) {
      // Eliminar video anterior si existía y se subió uno nuevo o cambió a externo
      if (lesson.isVideoUploaded && lesson.videoUrl && (videoFile?.size > 0 || !isVideoUploaded)) {
        await deleteUploadedFile(lesson.videoUrl);
      }
      
      lesson.title = title;
      lesson.description = description;
      lesson.order = order;
      lesson.duration = duration;
      lesson.isVideoUploaded = isVideoUploaded;
      // Solo actualizamos videoUrl si se envió un archivo nuevo o es link externo
      if ((isVideoUploaded && videoFile?.size > 0) || !isVideoUploaded) {
         lesson.videoUrl = videoUrl;
      }
    }
  } else {
    course.lessons.push({ title, description, videoUrl, isVideoUploaded, order, duration });
  }

  await course.save();
  revalidatePath(`/admin/elearning/course-form/${courseId}`);
  revalidatePath(`/academia/${courseId}`);
}

export async function deleteLesson(courseId: string, lessonId: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("No autorizado");

  await dbConnect();
  const course = await Course.findById(courseId);
  if (course) {
    const lesson = course.lessons.id(lessonId);
    if (lesson && lesson.isVideoUploaded && lesson.videoUrl) {
      await deleteUploadedFile(lesson.videoUrl);
    }
    course.lessons.pull(lessonId);
    await course.save();
  }
  revalidatePath(`/admin/elearning/course-form/${courseId}`);
  revalidatePath(`/academia/${courseId}`);
}

// -- Solicitudes y Progreso --

export async function requestCourseAccess(courseId: string) {
  const session = await getSession();
  if (!session) throw new Error("No autorizado");

  await dbConnect();
  const existingRequest = await CourseRequest.findOne({ user: session.userId, course: courseId });
  if (existingRequest) {
    return { success: false, message: "Ya has solicitado acceso a este curso." };
  }

  await CourseRequest.create({ user: session.userId, course: courseId });
  revalidatePath(`/academia/${courseId}`);
  return { success: true };
}

export async function getCourseRequests() {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("No autorizado");

  await dbConnect();
  const requests = await CourseRequest.find({ status: "pending" })
    .populate("user", "name email")
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .lean();
    
  return JSON.parse(JSON.stringify(requests));
}

export async function updateRequestStatus(requestId: string, status: "approved" | "rejected") {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("No autorizado");

  await dbConnect();
  await CourseRequest.findByIdAndUpdate(requestId, { status });
  revalidatePath("/admin/elearning/requests");
}

export async function getUserCourseStatus(courseId: string) {
  const session = await getSession();
  if (!session) return null;

  await dbConnect();
  const request = await CourseRequest.findOne({ user: session.userId, course: courseId }).lean();
  return request ? JSON.parse(JSON.stringify(request)) : null;
}

export async function updateProgress(courseId: string, lessonIndex: number, videoTimestamp: number) {
  const session = await getSession();
  if (!session) return;

  await dbConnect();
  await CourseRequest.findOneAndUpdate(
    { user: session.userId, course: courseId, status: "approved" },
    { currentLessonIndex: lessonIndex, videoTimestamp }
  );
}
