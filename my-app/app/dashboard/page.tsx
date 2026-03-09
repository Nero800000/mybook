"use client";

import { useState } from "react";
import { db } from "../service/connect";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/HookProtection";
import Link from "next/link";
import style from "@/app/styles/dashboard.module.css";

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [autor, setAutor] = useState("");
  const [content, setContent] = useState("");
  const [titulo, setTitle] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  
    if (!user) {
      router.push("/");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "books"), {
        title: titulo,
        autor: autor,
        content: content,
        userId: user.uid,
        userName: user.displayName,
        createdAt: new Date(),
      });

      console.log("Documento salvo:", docRef.id);

       // limapando formularioo
      setAutor("");
      setContent("");
      setTitle("");

      router.push("/");
    } catch (erro) {
      console.log("Deu erro:", erro);
    }
  };

  return (
    <div>
      <Link href="/">Voltar para home</Link>

      <form className={style.myForm} onSubmit={submit}>
        <label className={style.myLabel}>
          Título:
          <input
            className={style.myInput}
            type="text"
            placeholder="Digite o título do livro"
            value={titulo}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className={style.myLabel}>
          Autor:
          <input
            className={style.myInput}
            type="text"
            placeholder="Digite o autor do livro"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
          />
        </label>

        <label className={style.myLabel}>
          Conteúdo do livro:
          <textarea
            className={style.myInput}
            placeholder="Digite o conteúdo do livro"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <button className={style.myButton} type="submit">
          Enviar
        </button>
      </form>

      <button onClick={logout}>SAIR</button>
    </div>
  );
}
