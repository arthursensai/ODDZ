import { prisma } from "@/lib/prisma";

export async function GET(request: Request){
  try {
    const data = await request.json();

    const { email } = data;

    if(!email) return Response.json({ error: "No valid Credentiels"}, { status: 400 });

    const player = await prisma.player.findUnique({
      where: {
        email
      }
    })

    if(!player) return Response.json({ error: "No valid Credentiels"}, { status: 400 });

    return Response.json(player, { status: 200 });

  } catch (reason){
    const message = reason instanceof Error ? reason.message : "Unexpected error";
    return new Response(message, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { email, username, color } = data;

    if (!email || !username || !color)
      return Response.json({ error: "No valid credentials" }, { status: 400 });

    try {
      const updateUser = await prisma.player.update({
        where: {
          email: email,
        },
        data: {
          username: username,
          color: color
        },
      });

      if (!updateUser) return Response.json({ error: "No valid credentials" });

      return Response.json({ updateUser });
    } catch (err) {
      console.error(err);
      return Response.json({ error: "Server error try again later" });
    }
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : "Unexpected error";

    return new Response(message, { status: 500 });
  }
}
