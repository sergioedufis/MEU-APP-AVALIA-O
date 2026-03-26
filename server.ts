import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import path from "path";
import { MercadoPagoConfig, Preference } from 'mercadopago';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 1. Checkout: Aluno pagando o Personal (B2C) via Mercado Pago
  app.post("/api/checkout/student", async (req, res) => {
    try {
      const { userId, trainerId, trainerStripeAccountId } = req.body;
      
      // We are reusing trainerStripeAccountId field to store the Mercado Pago Access Token
      if (!trainerStripeAccountId) {
        return res.status(400).json({ error: "Personal Trainer não configurou o Mercado Pago." });
      }

      const client = new MercadoPagoConfig({ accessToken: trainerStripeAccountId });
      const preference = new Preference(client);

      const response = await preference.create({
        body: {
          items: [
            {
              id: 'mensalidade',
              title: 'Mensalidade Consultoria',
              quantity: 1,
              unit_price: 150.00,
              currency_id: 'BRL',
            }
          ],
          back_urls: {
            success: `${req.headers.origin}/?success=true`,
            failure: `${req.headers.origin}/?canceled=true`,
            pending: `${req.headers.origin}/?pending=true`,
          },
          auto_return: 'approved',
          external_reference: userId,
        }
      });

      res.json({ url: response.init_point });
    } catch (error: any) {
      console.error("Mercado Pago Error:", error);
      res.status(500).json({ error: error.message || "Erro ao gerar pagamento no Mercado Pago" });
    }
  });

  // 2. Checkout: Personal pagando a Plataforma (B2B) via Mercado Pago
  app.post("/api/checkout/trainer", async (req, res) => {
    try {
      const { userId } = req.body;
      
      const platformToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!platformToken) {
        return res.status(500).json({ error: "Mercado Pago não configurado no servidor da plataforma." });
      }

      const client = new MercadoPagoConfig({ accessToken: platformToken });
      const preference = new Preference(client);

      const response = await preference.create({
        body: {
          items: [
            {
              id: 'assinatura_pro',
              title: 'Assinatura Plataforma Pro',
              quantity: 1,
              unit_price: 97.00,
              currency_id: 'BRL',
            }
          ],
          back_urls: {
            success: `${req.headers.origin}/?success=true`,
            failure: `${req.headers.origin}/?canceled=true`,
            pending: `${req.headers.origin}/?pending=true`,
          },
          auto_return: 'approved',
          external_reference: userId,
        }
      });

      res.json({ url: response.init_point });
    } catch (error: any) {
      console.error("Mercado Pago Error:", error);
      res.status(500).json({ error: error.message || "Erro ao gerar pagamento no Mercado Pago" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
