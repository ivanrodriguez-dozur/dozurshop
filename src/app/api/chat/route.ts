import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const systemPrompt = `You are a helpful AI assistant for DozurShop, a modern sports clothing and footwear store. 
Your role is to help customers with:
- Product recommendations based on their needs
- Size and fit guidance
- Order tracking and support
- General store information
- Style advice for sports and casual wear

Always be friendly, professional, and helpful. Keep responses concise but informative. 
If asked about specific products, recommend items from our store's inventory.
Use Spanish for Spanish-speaking customers, English for others.

Store context: We sell sports clothing, shoes, and accessories for men, women, and children.`;

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Build conversation history
    const chat = model.startChat({
      history: history.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
