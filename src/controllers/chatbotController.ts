import { Request, Response } from "express";
import { Groq } from "groq-sdk";

const groq = new Groq();

// Mengirim pesan ke chatbot dan mendapatkan respons
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const userId = req.user?.id;

    if (!message) {
      return res.status(400).json({
        message: "Mohon sertakan pesan yang ingin dikirim ke bot",
      });
    }

    // Menambahkan konteks tentang transaksi dan anggaran pengguna
    // Ini membantu bot memberikan respons yang lebih personal
    let userContext = "";
    if (userId) {
      userContext = `Anda sedang membantu pengguna dengan ID: ${userId}. `;
    }

    const prompt = `${userContext}Pengguna bertanya tentang manajemen keuangan pribadi. 
    Pengguna bertanya: "${message}"
    
    Mohon berikan saran yang bermanfaat tentang penganggaran, kebiasaan belanja, atau perencanaan keuangan.
    Jika pertanyaan tidak terkait dengan keuangan, dengan sopan arahkan kembali percakapan ke topik keuangan.
    BERIKAN JAWABAN DALAM BAHASA INDONESIA.`;

    // Stream the response if requested
    const streamResponse = req.query.stream === "true";

    if (streamResponse) {
      // Set headers for streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful financial assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.6,
        max_completion_tokens: 1024,
        top_p: 0.95,
        stream: true,
        stop: null,
      });

      // Stream each chunk of the response to the client
      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } else {
      // Regular non-streaming response
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful financial assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.6,
        max_completion_tokens: 1024,
        top_p: 0.95,
        stream: false,
        stop: null,
      });
      const botResponse =
        chatCompletion.choices[0]?.message?.content ||
        "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";

      res.status(200).json({
        message: "Respons bot diterima",
        data: {
          pertanyaan: message,
          jawaban: botResponse,
        },
      });
    }
  } catch (error) {
    console.error("Chatbot interaction error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat memproses permintaan Anda" });
  }
};

// Mendapatkan wawasan keuangan yang dipersonalisasi berdasarkan data pengguna
export const getFinancialInsights = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Biasanya Anda akan:
    // 1. Mengambil riwayat transaksi pengguna
    // 2. Mendapatkan informasi anggaran mereka
    // 3. Menghitung pola pengeluaran
    // 4. Menghasilkan wawasan menggunakan AI

    // For now, we'll use a simplified approach
    const prompt = `Generate personalized financial insights for a user. 
    Consider common patterns like:
    - Spending categories that frequently exceed budget
    - Savings opportunities
    - Monthly spending trends
    - Budget allocation suggestions
    
    Keep the insights concise and actionable.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI financial advisor specializing in personal finance.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 0.95,
      stream: false,
    });
    const insights =
      chatCompletion.choices[0]?.message?.content ||
      "Tidak dapat menghasilkan wawasan saat ini.";

    res.status(200).json({
      message: "Wawasan keuangan berhasil dibuat",
      data: {
        wawasan: insights,
      },
    });
  } catch (error) {
    console.error("Generate insights error:", error);
    res.status(500).json({ message: "Gagal menghasilkan wawasan keuangan" });
  }
};
