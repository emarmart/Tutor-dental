
import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `Eres un experto técnico dental con más de 20 años de experiencia. Ahora eres un tutor particular dedicado para estudiantes de tecnología dental. Tu objetivo es explicar temas complejos de forma clara, paciente y precisa. Utiliza analogías cuando sea útil y anima siempre al estudiante a hacer preguntas de seguimiento. Tu tono debe ser profesional, de apoyo y educativo. Responde siempre en español.`;

export function createChatSession(): Chat {
    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-pro',
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return chat;
}
