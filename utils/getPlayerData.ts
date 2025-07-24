import { prisma } from "../lib/prisma";
import { Player } from "@prisma/client";

const getPlayerData = async(email: string):Promise<Player | null> => {

    const player = await prisma.player.findUnique({
          where: { email: email },
    });

    if(player) return player;
    return null;
};

export default getPlayerData;