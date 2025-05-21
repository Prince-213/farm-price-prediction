
import { prisma } from '@/app/prisma' ;

export async function GET() {

  const data = await prisma.prices.findMany();

  console.log(data);

  return Response.json({ data });
}
