import { useState } from "react";

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const handleSubmit = async (event) => {
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setQuestion("");
    const response = await fetch("http://127.0.0.1:3000/question", {
      method: "POST",
      body: JSON.stringify({ question }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    console.log("Got the response", response);
    setMessages((prev) => [...prev, response.message]);
  };

  return (
    <div>
      <section>
        {messages.map((message, index) => {
          return (
            <div key={index}>
              <strong>{message.role}:</strong> {message.content}
            </div>
          );
        })}
      </section>
      <label>
        Question:
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          type="text"
          name="question"
          required
        />
      </label>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

// sk - HZglSfgXABd7ex22I5qHT3BlbkFJXhnV4aEScw9xfIYqZCrE;
