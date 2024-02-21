import { Ollama } from "@langchain/community/llms/ollama";
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai';
import { PromptTemplate } from "@langchain/core/prompts";
import { BytesOutputParser } from '@langchain/core/output_parsers';

export const runtime = 'edge';

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.
 
Current conversation:
{chat_history}
 
User: {input}
AI:`;

export async function POST(req:Request) {
  const body = await req.json();
  const messages = body.messages ?? [];
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const currentMessageContent = messages[messages.length - 1].content;

  const prompt = PromptTemplate.fromTemplate(TEMPLATE);

  const llm = new Ollama({
    baseUrl: "http://localhost:11434", // Default value
    model: "mistral",
  });
  
  const outputParser = new BytesOutputParser();

  const chain = prompt.pipe(llm).pipe(outputParser);

  const stream = await chain.stream({
    chat_history: formattedPreviousMessages.join('\n'),
    input: currentMessageContent,
  });
 
  return new StreamingTextResponse(stream);
}

/*import { HfInference } from '@huggingface/inference';
import { HuggingFaceStream, StreamingTextResponse } from 'ai';
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';
 
// Create a new HuggingFace Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
 
  const response = Hf.textGenerationStream({
    model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
    inputs: experimental_buildOpenAssistantPrompt(messages),
    parameters: {
      max_new_tokens: 200,
      // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false,
    },
  });
 
  // Convert the response into a friendly text-stream
  const stream = HuggingFaceStream(response);
 
  // Respond with the stream
  return new StreamingTextResponse(stream);
}*/