import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { storage } from "./storage";
import { 
  insertRabbitSchema,
  insertBreedingRecordSchema,
  insertOffspringSchema,
  insertExpenseSchema,
  insertButcherRecordSchema
} from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `rabbit-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    
    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Photo upload endpoint
  app.post("/api/upload-photo", upload.single('photo'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const photoUrl = `/uploads/${req.file.filename}`;
      res.json({ photoUrl });
    } catch (error) {
      res.status(500).json({ message: "Upload failed" });
    }
  });

  // Serve uploaded files
  app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), 'uploads', filename);
    res.sendFile(filePath);
  });


  
  // Rabbits routes
  app.get("/api/rabbits", async (req, res) => {
    const rabbits = await storage.getRabbits();
    res.json(rabbits);
  });

  app.get("/api/rabbits/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const rabbit = await storage.getRabbit(id);
    if (!rabbit) {
      return res.status(404).json({ message: "Rabbit not found" });
    }
    res.json(rabbit);
  });

  app.post("/api/rabbits", async (req, res) => {
    try {
      const validatedData = insertRabbitSchema.parse(req.body);
      const rabbit = await storage.createRabbit(validatedData);
      res.status(201).json(rabbit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/rabbits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRabbitSchema.partial().parse(req.body);
      const rabbit = await storage.updateRabbit(id, validatedData);
      if (!rabbit) {
        return res.status(404).json({ message: "Rabbit not found" });
      }
      res.json(rabbit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/rabbits/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteRabbit(id);
    if (!success) {
      return res.status(404).json({ message: "Rabbit not found" });
    }
    res.status(204).send();
  });

  // Breeding records routes
  app.get("/api/breeding-records", async (req, res) => {
    const records = await storage.getBreedingRecords();
    res.json(records);
  });

  app.post("/api/breeding-records", async (req, res) => {
    try {
      const validatedData = insertBreedingRecordSchema.parse(req.body);
      const record = await storage.createBreedingRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/breeding-records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBreedingRecordSchema.partial().parse(req.body);
      const record = await storage.updateBreedingRecord(id, validatedData);
      if (!record) {
        return res.status(404).json({ message: "Breeding record not found" });
      }
      res.json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/breeding-records/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteBreedingRecord(id);
    if (!success) {
      return res.status(404).json({ message: "Breeding record not found" });
    }
    res.status(204).send();
  });

  // Offspring routes
  app.get("/api/offspring", async (req, res) => {
    const { breedingRecordId } = req.query;
    if (breedingRecordId) {
      const offspring = await storage.getOffspringByBreedingRecord(parseInt(breedingRecordId as string));
      return res.json(offspring);
    }
    const offspring = await storage.getOffspring();
    res.json(offspring);
  });

  app.post("/api/offspring", async (req, res) => {
    try {
      const validatedData = insertOffspringSchema.parse(req.body);
      const offspring = await storage.createOffspring(validatedData);
      res.status(201).json(offspring);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/offspring/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertOffspringSchema.partial().parse(req.body);
      const offspring = await storage.updateOffspring(id, validatedData);
      if (!offspring) {
        return res.status(404).json({ message: "Offspring not found" });
      }
      res.json(offspring);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Expenses routes
  app.get("/api/expenses", async (req, res) => {
    const { startDate, endDate } = req.query;
    if (startDate && endDate) {
      const expenses = await storage.getExpensesByDateRange(startDate as string, endDate as string);
      return res.json(expenses);
    }
    const expenses = await storage.getExpenses();
    res.json(expenses);
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const validatedData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(validatedData);
      res.status(201).json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/expenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertExpenseSchema.partial().parse(req.body);
      const expense = await storage.updateExpense(id, validatedData);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteExpense(id);
    if (!success) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(204).send();
  });

  // Butcher records routes
  app.get("/api/butcher-records", async (req, res) => {
    const records = await storage.getButcherRecords();
    res.json(records);
  });

  app.post("/api/butcher-records", async (req, res) => {
    try {
      const validatedData = insertButcherRecordSchema.parse(req.body);
      const record = await storage.createButcherRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/butcher-records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertButcherRecordSchema.partial().parse(req.body);
      const record = await storage.updateButcherRecord(id, validatedData);
      if (!record) {
        return res.status(404).json({ message: "Butcher record not found" });
      }
      res.json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Statistics route for dashboard
  app.get("/api/stats", async (req, res) => {
    const rabbits = await storage.getRabbits();
    const breedingRecords = await storage.getBreedingRecords();
    const expenses = await storage.getExpenses();
    
    const totalRabbits = rabbits.filter(r => r.status === 'active').length;
    const activeBreeders = rabbits.filter(r => r.isBreeder && r.status === 'active').length;
    const littersDue = breedingRecords.filter(r => r.status === 'expecting').length;
    
    // Calculate monthly expenses
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyExpenses = expenses
      .filter(e => e.date.startsWith(currentMonth))
      .reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0);

    res.json({
      totalRabbits,
      activeBreeders,
      littersDue,
      monthlyExpenses: monthlyExpenses.toFixed(2)
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
