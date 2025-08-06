const promptInput = document.getElementById("promptInput");
const sendButton = document.getElementById("sendButton");
const messagesContainer = document.getElementById("messages");

const OPENROUTER_API_KEY = "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"; 
const YOUR_SITE_URL = "https://github.com/vellur-raghavan/aichat/"; 

function addMessage(role, content) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.classList.add(role === "user" ? "user-message" : "ai-message");
    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; 
}

async function sendMessage() {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    addMessage("user", prompt);
    promptInput.value = ""; 

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": YOUR_SITE_URL, 
                "X-Title": "My OpenRouter Chat App", 
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo", 
                messages: [{ role: "user", content: prompt }],
            }),
        });

        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content || "Error: Could not get a response.";
        addMessage("ai", aiResponse);
    } catch (error) {
        console.error("Error sending message to OpenRouter:", error);
        addMessage("ai", "Error: Something went wrong. Please try again.");
    }
}

sendButton.addEventListener("click", sendMessage);

promptInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
