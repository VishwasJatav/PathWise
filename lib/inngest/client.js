import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "pathwise",
  name: "PathWise",
  apiKey: process.env.GEMINI_API_KEY, // directly pass API key
});
