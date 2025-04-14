import { cookies } from "next/headers";
import { prisma } from "../../../lib/prisma/index";

export async function GET() {
  const cookieStore = await cookies();
  const id = cookieStore.get("id");

  const data = await prisma.post.findMany();

  console.log(data);

  return Response.json({ data });
}
