
import { prisma } from "../../../lib/prisma/index";

export async function GET() {

  const data = await prisma.post.findMany();

  console.log(data);

  return Response.json({ data });
}
