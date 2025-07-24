import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const data = await request.json();

  const { email, roomID } = data;

  if(!email || !roomID) return Response.json({ error: "No valid Credentials"}, { status: 400 });

  try {
    const player = await prisma.player.findUnique({
      where: { email },
    });

    if (!player || player.inGame)
      return Response.json({ error: "No valid player!" }, { status: 400 });

    const userID = player.id;

    try {
      const room = await prisma.game.update({
        where: {
            roomID: roomID
        },
        data: {
            players: {
                connect: {id: userID}
            }
        }
      })

      await prisma.player.update({
        where: { email },
        data: {
          inGame: true,
          games: {
            connect: { id: room.id}
          }
        }
      })

      return Response.json(room, { status: 200 });
    } catch (err) {
      console.error(err);
      return Response.json({ error: "Server Side Error!" }, { status: 500 });
    }
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : "Unexpected error";

    return new Response(message, { status: 500 });
  }
}
