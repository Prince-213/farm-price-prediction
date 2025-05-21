
import { prisma } from '@/app/prisma' ;

export async function GET() {

  const data = await prisma.notifications.findMany();

  console.log(data);

  return Response.json({ data });
}
