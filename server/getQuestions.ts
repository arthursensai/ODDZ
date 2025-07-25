import Together from "together-ai";
import prompt from "./prompt";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY!,
});

const AIMODEL = process.env.AI_MODEL!;
if (!AIMODEL) throw new Error("AI_MODEL is not defined");

const cleanJSONResponse = (response: string): string => {
  return response
    .replace(/```json\s*/i, "") // remove starting ```json
    .replace(/```$/, "")        // remove ending ```
    .trim();
};

const getQuestions = async () => {
  try {
    const response = await together.chat.completions.create({
      model: AIMODEL,
      messages: [{ role: "user", content: prompt }],
    });

    const rawContent = response?.choices?.[0]?.message?.content || "";
    const cleaned = cleanJSONResponse(rawContent);
    const parsed = JSON.parse(cleaned);

    return parsed;
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("AI failed to generate valid JSON.");
  }
};

export default getQuestions;