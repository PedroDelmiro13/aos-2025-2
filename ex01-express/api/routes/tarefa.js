import { Router } from "express";
import models from "../models";
const { Tarefa } = models;

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tarefas = await Tarefa.findAll();
    return res.json(tarefas);
  } catch (e) {
    return res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

router.get("/:tarefaId", async (req, res) => {
  try {
    const tarefa = await Tarefa.findByPk(req.params.tarefaId);
    if (!tarefa) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    return res.json(tarefa);
  } catch (e) {
    return res.status(500).json({ error: "Erro ao buscar tarefa" });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("Body recebido:", req.body);
    const tarefa = await Tarefa.create({
      descricao: req.body.descricao,
      concluido: req.body.concluido
    });
    return res.status(201).json(tarefa);
  } catch (e) {
    console.error("Erro ao criar tarefa:", e.name, e.errors ? e.errors.map(err => err.message) : e.message);
    return res.status(500).json({ error: "Erro ao criar tarefa" });
  }
});

router.put("/:tarefaId", async (req, res) => {
  try {
    const tarefa = await Tarefa.findByPk(req.params.tarefaId);
    if (!tarefa) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    await tarefa.update(req.body);
    return res.json(tarefa);
  } catch (e) {
    return res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
});

router.delete("/:tarefaId", async (req, res) => {
  try {
    const deleted = await Tarefa.destroy({ where: { id: req.params.tarefaId } });
    if (!deleted) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    return res.json({ message: "Tarefa deletada com sucesso" });
  } catch (e) {
    return res.status(500).json({ error: "Erro ao deletar tarefa" });
  }
});

export default router;
