import { cookies } from "next/headers";
import { prisma } from '@/app/prisma' ;

export async function GET() {
  const cookieStore = await cookies();
  const id = cookieStore.get("id");

  const data = await prisma.farmer.findUnique({
    where: {
      id: id?.value
    },
    include: {
      predictions: true
    }
  });

  console.log(data);

  return Response.json({ data });
}
