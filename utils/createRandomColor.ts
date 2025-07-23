import { Color } from "../node_modules/.prisma/client";

const getRandomColor = (): Color => {
  const enumValues = Object.values(Color);
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex] as Color;
};

export default getRandomColor;