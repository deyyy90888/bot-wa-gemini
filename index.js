
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ganti API Key di bawah kalau punya yang baru
const genAI = new GoogleGenerativeAI("AIzaSyAabdAvyNhL3TS2OzHmwCsUEM--sSmNHd8");

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
    },
});

client.on("qr", (qr) => {
    console.log("SCAN QR INI:");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Bot Gemini Online! 🚀");
});

client.on("message", async (msg) => {
    const nomorPacar = "6285357899766@c.us";
    const nomorPribadi = "62895604918490@c.us";
    const daftarVip = [nomorPacar, nomorPribadi];

    if (!daftarVip.includes(msg.from)) return;

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: msg.from === nomorPacar ? "Panggil Sayang, romantis." : "Panggil Bos, singkat."
        });
        const result = await model.generateContent(msg.body);
        await msg.reply(result.response.text());
    } catch (err) {
        console.error("Error Gemini:", err);
    }
});

client.initialize();
