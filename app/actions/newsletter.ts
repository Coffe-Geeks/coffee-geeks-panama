"use server";

import dbConnect from "@/lib/mongodb";
import NewsletterEmail from "@/models/NewsletterEmail";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { agregarContactoBrevo } from "@/lib/brevo";

// Regex de correo electrónico
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export async function subscribeEmail(email: string) {
  try {
    if (!email) {
      return { error: "El correo electrónico es obligatorio." };
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return { error: "Por favor, ingresa un correo electrónico válido." };
    }

    await dbConnect();

    // Buscar duplicado
    const exists = await NewsletterEmail.findOne({ email: cleanEmail });
    if (exists) {
      return { error: "Este correo ya está registrado en el boletín." };
    }

    await NewsletterEmail.create({ email: cleanEmail });
    await agregarContactoBrevo(cleanEmail);

    revalidatePath("/admin/newsletter");
    return { success: "¡Te has suscrito correctamente al boletín!" };
  } catch (err: any) {
    console.error("Error subscribing email:", err);
    return { error: "Ocurrió un error al procesar tu solicitud." };
  }
}

export async function getNewsletterEmails(search = "", page = 1, limit = 50) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      throw new Error("No autorizado");
    }

    await dbConnect();

    const query: any = {};
    if (search) {
      query.email = { $regex: search.trim(), $options: "i" };
    }

    const skip = (page - 1) * limit;
    const emails = await NewsletterEmail.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await NewsletterEmail.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      emails: JSON.parse(JSON.stringify(emails)),
      totalPages,
      totalCount,
    };
  } catch (err: any) {
    console.error("Error fetching newsletter emails:", err);
    throw new Error(err.message || "Error al obtener correos");
  }
}

export async function deleteNewsletterEmail(id: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      throw new Error("No autorizado");
    }

    await dbConnect();

    await NewsletterEmail.findByIdAndDelete(id);

    revalidatePath("/admin/newsletter");
    return { success: "Correo eliminado correctamente." };
  } catch (err: any) {
    console.error("Error deleting newsletter email:", err);
    throw new Error(err.message || "Error al eliminar correo");
  }
}
