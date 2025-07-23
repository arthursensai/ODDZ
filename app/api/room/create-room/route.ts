import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  const data = await request.json();

  const { email, name } = data;
  const roomID = nanoid(6);
  const roomName = name;

  try {
    const player = await prisma.player.findUnique({
      where: { email },
    });

    if (!player || player.inGame)
      return Response.json({ error: "No valid player!" }, { status: 400 });

    const userID = player.id;

    try {
      const room = await prisma.game.create({
        data: {
          roomID: roomID,
          name: roomName,
          players: {
            connect: {
              id: userID,
            },
          },
        },
      });

      await prisma.player.update({
        where: { email },
        data: {
          inGame: true
        }
      })

      return Response.json(room, { status: 201 });
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
