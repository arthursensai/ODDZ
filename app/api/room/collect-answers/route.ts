import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, playerResponse, gameId } = data;

    const player = await prisma.player.findUnique({
      where: { email },
    });

    const game = await prisma.game.findUnique({
      where: { roomID: gameId },
    });

    if(!game) {
      return new Response("game not found", { status: 404 });
    }

    if (!player) {
      return new Response("Player not found", { status: 404 });
    }

    await prisma.answer.create({
      data: {
        content: playerResponse,
        playerId: player.id,
        gameId: game.id,
      },
    });

    return new Response("Answer saved", { status: 201 });
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : "Unexpected error";

    return new Response(message, { status: 500 });
  }
}
