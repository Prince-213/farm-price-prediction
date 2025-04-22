
import { prisma } from "../../../lib/prisma/index";

export async function GET() {

  const data = await prisma.notifications.findMany();

  console.log(data);

  return Response.json({ data });
}
