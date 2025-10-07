import { Router } from "express";
import models from "../models";
import jwt from "jsonwebtoken";
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

router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email obrigatório" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    
    const token = jwt.sign(
      { id: user.id_usuario, email: user.email, username: user.username },
      process.env.MY_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/cadastro", async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      throw new Error("Username e email são obrigatórios");
    }

    const newUser = await User.create({ username, email });

    const token = jwt.sign(
      { id: newUser.id_usuario, email: newUser.email, username: newUser.username },
      process.env.MY_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Usuário criado",
      data: { newUser, token },
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
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
