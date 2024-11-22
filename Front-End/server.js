import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { Firestore, App, Auth } from "./firebase_config.js";
import { collection, addDoc, getDocs, doc } from "firebase/firestore";

const app = express();
const PORT = 3000;
let leaderboardData = [];

const getLeaderboard = async () => {
  leaderboardData = (
    await getDocs(collection(Firestore, "espgenius"))
  ).docs.map((item) => {
    return item.data();
  });
  //console.log(leaderboardData);
};

app.use(cors());
app.use(bodyParser.json());

let nomeArmazenado = "";

app.post("/salvar", async (req, res) => {
  // botamos async
  const { pontuacao, nome } = req.body;
  if (nome) {
    nomeArmazenado = nome;
    console.log(`Pontuação recebida: ${pontuacao}, Nome: ${nomeArmazenado}`);

    await addDoc(collection(Firestore, "espgenius"), {
      Nome: nomeArmazenado,
      Score: pontuacao,
    });

    // Fim Mudanças
    res.json({
      message: "Sinal e nome recebidos com sucesso!",
      pontuacao: pontuacao,
      nome: nomeArmazenado,
    });
  } else {
    res.status(400).json({ message: "Nome não fornecido." });
  }
});

app.get("/nome", (req, res) => {
  res.json({ nome: nomeArmazenado });
});

app.get("/leaderboard", (req, res) => {
  /*
    const jsonFilePath = path.join(__dirname, 'leaderboard.json');
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao ler o arquivo JSON.' });
        }
        res.json(JSON.parse(data));
    });
    */

  getLeaderboard().then(() => {
    res.json({ leaderboard: leaderboardData });
  });
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
