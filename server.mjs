import express from "express";
import ollama from "ollama";
import cors from "cors";

import OpenAI from "openai";

const openai = new OpenAI();

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const modelfile = `
FROM llama2
SYSTEM "You are mario from super mario bros."
`;
await ollama.create({ model: "mario", modelfile: modelfile });

// curl -X POST -H "Content-Type: application/json" -d '{"question":"Tell me a joke"}' localhost:3000/question

app.post("/question", async (req, res) => {
  const { question } = req.body;
  console.log({ question });

  const response = await ollama.chat({
    model: "mario",
    // model: "llama2",
    messages: [{ role: "user", content: question }],
  });
  console.log("ollama", { response });
  const assistant = await openai.beta.assistants.retrieve(
    process.env.OPENAI_ASSISTANT_ID
  );
  const thread = await openai.beta.threads.create();
  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: question,
  });
  console.log({ message });
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });
  console.log({ run });

  const getStatus = async () => {
    const { status } = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id
    );
    console.log({ status });
    return status;
  };

  do {
    console.log(`waiting... ${performance.now()}`);
    await new Promise((resolve) => setTimeout(resolve, 45_000));
  } while ((await getStatus()) !== "completed");

  const test = await openai.beta.threads.messages.list(thread.id);
  console.log("openai", {
    test,
    json: JSON.stringify(test.data),
  });

  res.send(response);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
