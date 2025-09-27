import { v4 as uuidv4 } from "uuid";
import { Router } from "express";
import models from "../models";
const { Message } = models;

const router = Router();

router.get("/", async (req, res) => {
  try {
    const messages = await Message.findAll();
    return res.json(messages);
  } catch (e) {
    return res.status(500).json({ error: "Erro ao buscar mensagens" });
  }
});

router.get("/:messageId", async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.messageId);
    if (!message) {
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }
    return res.json(message);
  } catch (e) {
    return res.status(500).json({ error: "Erro ao buscar a mensagem" });
  }
});

router.put("/:messageId", async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    await message.update({ text: req.body.text });
    return res.json(message);
  } catch (e) {
    return res.status(500).json({ error: "Erro ao atualizar a mensagem" });
  }
});

router.post("/", async (req, res) => {
  try {
    const message = await Message.create({
      text: req.body.text,
      userId: req.context.me.id,
    });
    return res.status(201).json(message);
  } catch (e) {
    return res.status(500).json({ error: "Erro ao criar a mensagem" });
  }
});

router.delete("/:messageId", async (req, res) => {
  try {
    const deleted = await Message.destroy({
      where: { id: req.params.messageId },
    });
    if (!deleted) {
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }
    return res.json({ message: "Deletado com sucesso" });
  } catch (e) {
    return res.status(500).json({ error: "Erro ao deletar a mensagem" });
  }
});

export default router;