"use server";

import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { saveUploadedFile } from "@/lib/upload";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

async function generateUniqueSlug(title: string, currentId?: string) {
  let slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const existing = await BlogPost.findOne({ slug: uniqueSlug });
    if (!existing || (currentId && existing._id.toString() === currentId)) {
      break;
    }
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}

export async function getBlogPosts(page = 1, limit = 10, onlyPublished = true) {
  await dbConnect();
  const query = onlyPublished ? { isPublished: true } : {};
  const skip = (page - 1) * limit;
  
  const posts = await BlogPost.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
    
  const total = await BlogPost.countDocuments(query);
  
  return { 
    posts: JSON.parse(JSON.stringify(posts)), 
    total,
    totalPages: Math.ceil(total / limit)
  };
}

export async function getBlogPostBySlug(slug: string) {
  await dbConnect();
  const post = await BlogPost.findOne({ slug }).lean();
  return post ? JSON.parse(JSON.stringify(post)) : null;
}

export async function getBlogPostById(id: string) {
  await dbConnect();
  const post = await BlogPost.findById(id).lean();
  return post ? JSON.parse(JSON.stringify(post)) : null;
}

export async function saveBlogPost(formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return { error: "No autorizado." };
    }

    await dbConnect();

    const id = formData.get("id")?.toString();
    const title = formData.get("title")?.toString() || "";
    const shortDescription = formData.get("shortDescription")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const isPublished = formData.get("isPublished") === "true";
    
    if (!title) return { error: "El título es obligatorio." };

    const slug = await generateUniqueSlug(title, id);

    const updateData: any = {
      title,
      slug,
      shortDescription,
      content,
      isPublished,
    };

    const mainImageFile = formData.get("mainImage") as File | null;
    if (mainImageFile && mainImageFile.size > 0) {
      updateData.mainImage = await saveUploadedFile(mainImageFile, "blog");
    }

    if (id) {
      await BlogPost.findByIdAndUpdate(id, updateData);
    } else {
      await BlogPost.create(updateData);
    }

    revalidatePath("/admin/blogs");
    revalidatePath("/");
    revalidatePath("/blogs");
    if (slug) revalidatePath(`/blog/${slug}`);

    return { success: "Post guardado correctamente." };
  } catch (err) {
    console.error(err);
    return { error: "Error al guardar el post." };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return { error: "No autorizado." };
    }

    await dbConnect();
    await BlogPost.findByIdAndDelete(id);

    revalidatePath("/admin/blogs");
    revalidatePath("/");
    revalidatePath("/blogs");

    return { success: "Post eliminado." };
  } catch (err) {
    return { error: "Error al eliminar el post." };
  }
}

// Para el editor WYSIWYG
export async function uploadBlogImage(formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return { error: "No autorizado." };
    }

    const file = formData.get("image") as File;
    if (!file) return { error: "No se proporcionó ninguna imagen." };

    const url = await saveUploadedFile(file, "blog-content");
    return { url };
  } catch (err) {
    return { error: "Error al subir la imagen." };
  }
}
