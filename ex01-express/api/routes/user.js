import { Router } from "express";
import models from "../models";
const { User } = models;

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("Body recebido:", req.body);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email
    });
    return res.status(201).json(user);
  } catch (e) {
    console.error("Erro ao criar usuário:", e.name, e.errors ? e.errors.map(err => err.message) : e.message);
    return res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    await user.update(req.body);
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.userId } });
    if (!deleted) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    return res.json({ message: "Usuário deletado com sucesso" });
  } catch (e) {
    return res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

export default router;
