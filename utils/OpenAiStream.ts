// import {
//   createParser,
//   ParsedEvent,
//   ReconnectInterval,
// } from "eventsource-parser";

// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });
  
//   export type ChatGPTAgent = "user" | "system";
  
//   export interface ChatGPTMessage {
//     role: ChatGPTAgent;
//     content: string;
//   }
  
//   export interface OpenAIStreamPayload {
//     model: string;
//     messages: ChatGPTMessage[];
//     temperature: number;
//     top_p: number;
//     frequency_penalty: number;
//     presence_penalty: number;
//     max_tokens: number;
//     stream: boolean;
//     n: number;
//   }
  
//   export async function OpenAIStream(payload: OpenAIStreamPayload) {
//     const encoder = new TextEncoder();
//     const decoder = new TextDecoder();
  
  
//     // const res = await fetch("https://api.openai.com/v1/chat/completions", {
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //     Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
//     //   },
//     //   method: "POST",
//     //   body: JSON.stringify(payload),
//     // });

//     async function main() {
//       const chatCompletion = await openai.chat.completions.create({
//         messages: [{ role: 'user', content: 'Say this is a test' }],
//         model: 'gpt-3.5-turbo',
//       });

//       console.log('chatCompletion >>>>>>>>', chatCompletion);
      
//     }
    
//     main();
    

//     const stream = new ReadableStream({
//       async start(controller) {
//         // callback
//         function onParse(event: ParsedEvent | ReconnectInterval) {
//           if (event.type === "event") {
//             const data = event.data;
//             // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
//             if (data === "[DONE]") {
//               controller.close();
//               return;
//             }
//             try {
//               const json = JSON.parse(data);
//               const text = json.choices[0].delta?.content || '';
//               const queue = encoder.encode(text);
//               controller.enqueue(queue);
//             } catch (e) {
//               // maybe parse error
//               controller.error(e);
//             }
//           }
//         }
  
//         // stream response (SSE) from OpenAI may be fragmented into multiple chunks
//         // this ensures we properly read chunks and invoke an event for each SSE event stream
//         const parser = createParser(onParse);
//         // https://web.dev/streams/#asynchronous-iteration
//         // for await (const chunk of res as any) {
//         //   parser.feed(decoder.decode(chunk));
//         // }
//       },
//     });
  
//     return stream;
//   }

