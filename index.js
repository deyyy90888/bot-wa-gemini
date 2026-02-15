const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { GoogleGenerativeAI } = require("@google/generative-ai");

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
    // LOG UNTUK DEBUG (Cek di terminal pas kamu nge-chat)
    console.log(`Ada chat masuk dari: ${msg.from}`);
    console.log(`Isi Chat: ${msg.body}`);

    const nomorPacar = "6285357899766@c.us";
    const nomorPribadi = "62895604918490@c.us";
    const daftarVip = [nomorPacar, nomorPribadi];

    // Jika yang nge-chat bukan nomor VIP, abaikan
    if (!daftarVip.includes(msg.from)) {
        console.log("Nomor bukan VIP, dicuekin.");
        return;
    }

    try {
        console.log("Nomor cocok! Lagi mikir jawabannya...");
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Coba tanpa systemInstruction dulu biar enteng
        const result = await model.generateContent(msg.body);
        const jawaban = result.response.text();

        await msg.reply(jawaban);
        console.log("Jawaban terkirim!");
    } catch (err) {
        console.log("Error nih bro, cek:");
        console.error(err);
    }
});

client.initialize();
