import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    const { messages, character, numChoices = 3, mode = 'choices' } = await req.json();
    let prompt = '';
    let gptMessages = [];
    if (mode === 'npc') {
      // Generate a single NPC response
      prompt = `You are the character ${character.name} (${character.role}, status: ${character.status}, trust: ${character.trustLevel}) in a dystopian social credit simulator. Given the conversation so far, reply in character as the NPC. Respond to the last player message. Reply as a single message, not as a list or JSON.`;
      gptMessages = [
        { role: 'system', content: prompt },
        ...messages.map((m: any) => ({
          role: m.speaker === 'player' ? 'user' : 'assistant',
          content: m.text
        }))
      ];
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: gptMessages,
        temperature: 0.8,
        max_tokens: 256
      });
      const npcText = completion.choices[0].message?.content?.trim() || '';
      return NextResponse.json({ npc: npcText });
    } else {
      // Generate player choices (default)
      prompt = `You are the Central Algorithm™ in a dystopian social credit simulator. Given the conversation so far and the character's persona, generate ${numChoices} possible player replies. Each reply should be distinct, fit the tone, and have a clear social credit impact (pro-regime, neutral, or anti-regime). Format as a JSON array of objects: [{text, type (safe|risky|dangerous), scoreImpact}].`;
      gptMessages = [
        { role: 'system', content: prompt },
        ...messages.map((m: any) => ({
          role: m.speaker === 'player' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'system', content: `Character: ${character.name}, Role: ${character.role}, Status: ${character.status}, Trust Level: ${character.trustLevel}` }
      ];
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: gptMessages,
        temperature: 0.8,
        max_tokens: 512
      });
      let choices = [];
      try {
        // @ts-ignore: s flag requires es2018 target
        const match = completion.choices[0].message?.content?.match(/\[.*\]/s);
        choices = match ? JSON.parse(match[0]) : [];
      } catch (e) {
        choices = [];
      }
      return NextResponse.json({ choices });
    }
  } catch (error) {
    let message = 'Unknown error';
    if (typeof error === 'object' && error && 'message' in error) {
      message = (error as any).message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 