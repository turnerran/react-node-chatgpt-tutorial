import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";

const { ORGANIZATION: organization, API_KEY: apiKey } = process.env;

const configuration = new Configuration({
  organization,
  apiKey,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 8000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.post("/", async (request, response) => {
  const { chats } = request.body;
  try {
    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are ChatGPT. You can help with software tasks",
        },
        ...chats,
      ],
    });
    response.json({
      output: result.data.choices[0].message,
    });
  } catch (error) {
    response.json({
      output: error.message,
    });
  }
});
