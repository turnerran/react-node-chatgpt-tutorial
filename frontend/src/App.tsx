import { FormEvent, useEffect, useRef, useState } from "react";
import "./App.css";

const url = "http://localhost:8000/";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

function App() {
  const divRef = useRef<null | HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    divRef?.current?.scrollIntoView({ behavior: "smooth" });
  });

  const chat = async (e: FormEvent<HTMLFormElement>, message: string) => {
    e.preventDefault();
    if (!message) {
      return;
    }
    setIsTyping(true);

    const msgs: Message[] = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chats,
        }),
      });
      const data = await response.json();

      msgs.push(data.output);
      setChats(msgs);
      setIsTyping(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <h1>FullStack Chat GPT</h1>

      <section>
        {chats?.length
          ? chats.map((chat, index) => (
              <div
                key={index}
                className={
                  (chat.role === "user" ? "user_msg" : "assistant_msg") +
                  " message"
                }
              >
                <span>
                  <b>{chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                <span>{chat.content}</span>
              </div>
            ))
          : ""}
      </section>
      {isTyping && (
        <div className="message typing">
          <div className="typing__dot"></div>
          <div className="typing__dot"></div>
          <div className="typing__dot"></div>
        </div>
      )}
      <div ref={divRef} />
      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}
export default App;
