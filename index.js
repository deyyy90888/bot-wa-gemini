const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const API_KEY = "AIzaSyDaQUjV_o4q8Poyl8l1tjlyTKYVfCbZ7Ek";

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ["--no-sandbox", "--disable-setuid-sandbox"] }
});

client.on("qr", (qr) => qrcode.generate(qr, { small: true }));
client.on("ready", () => console.log("BOT WA SUDAH NYALA! 🔥"));

client.on("message", async (msg) => {
    // Filter Nomor (Ganti kalau salah)
    if (msg.from !== "6285357899766@c.us" && msg.from !== "62895604918490@c.us") return;

    try {
        console.log("Lagi nanya Google...");
        // Tembak langsung ke API Google tanpa library rewel
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: msg.body }] }]
            })
        });

        const data = await response.json();
        
        // Cek kalau Google ngasih error lagi
        if (data.error) {
            console.error("Google Marah:", data.error.message);
            return;
        }

        const jawaban = data.candidates[0].content.parts[0].text;
        await msg.reply(jawaban);
        console.log("Terjawab!");

    } catch (err) {
        console.error("Error Koneksi:", err.message);
    }
});

client.initialize();
