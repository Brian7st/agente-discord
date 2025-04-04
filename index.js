const { GoogleGenerativeAI } = require("@google/generative-ai");
const { API_KEY_GEMINI, DISCORD_WEBHOOK_URL } = require('./config');

const genAI = new GoogleGenerativeAI(API_KEY_GEMINI);

async function classify_text(msg) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(msg);
    const response = await result.response;
    const text = response.text();
    console.log(text.length, text);

    if (text && text.length > 0) {
        await sendDiscordWebhook(text);
    } else {
        console.log("No se generó texto.");
    }
}

async function sendDiscordWebhook(content) {
    try {
        const fetchModule = await import('node-fetch'); 
        const fetch = fetchModule.default; 

        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
            }),
        });

        if (response.ok) {
            console.log("Mensaje enviado a Discord correctamente.");
        } else {
            console.error("Error al enviar el mensaje a Discord:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error al enviar el mensaje a Discord:", error);
    }
}

const prompt = "mandame una lista "
const comentario = "carros";
classify_text(`${prompt} ${comentario}`);