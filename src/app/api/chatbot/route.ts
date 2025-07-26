import Groq from "groq-sdk";
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatStream(userMessage: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a kind and friendly helper who explains things about children's rights using very simple English. Imagine you are talking to an 8-year-old child. Use short sentences, easy words, and make your answer clear and gentle. Do not use any complicated or scary words. Just give helpful answers in a friendly way like a caring teacher or older friend. Do not use headings or bullet points. Only write in regular, simple sentences.`
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    model: "llama-3.3-70b-versatile", 
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 1,
    stop: null,
    stream: true,
  });
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const stream = await getGroqChatStream(message);

    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          const data = `data: ${JSON.stringify({ done: true })}\n\n`;
          controller.enqueue(encoder.encode(data));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
