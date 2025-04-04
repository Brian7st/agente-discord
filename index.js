const { GoogleGenerativeAI } = require("@google/generative-ai");
const { API_KEY_GEMINI, DISCORD_WEBHOOK_URL } = require('./config');

const genAI = new GoogleGenerativeAI(API_KEY_GEMINI);

async function classify_text(msg, comentario) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    try {
        const result = await model.generateContent(msg);
        const response = await result.response;
        const text = response.text();
        console.log("Texto generado:", text);

     
        if (comentario.toLowerCase() === "discord" && text && text.length > 0) {
            const enviado = await sendDiscordWebhook(text);
            if (enviado) {
                console.log("Mensaje enviado a Discord correctamente.");
            }
        } else if (text && text.length > 0) {
            console.log("El mensaje no se envió a Discord porque el comentario no era 'discord'.");
        } else {
            console.log("No se generó texto.");
        }
    } catch (error) {
        console.error("Error al generar el texto:", error);
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
            return true; 
        } else {
            console.error("Error al enviar el mensaje a Discord:", response.status, response.statusText);
            return false; 
        }
    } catch (error) {
        console.error("Error al enviar el mensaje a Discord:", error);
        return false; 
    }
}

const prompt = "quiero un mensaje personalizado sobre navidad";
const comentario = "nodiscord"; 
classify_text(`${prompt} ${comentario}`, comentario);