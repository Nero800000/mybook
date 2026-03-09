

"use client";

import { useEffect, useState } from "react";
import { db } from "./service/connect";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import styles from '@/app/styles/home.module.css'
import { useAuth } from "./components/HookProtection";


interface Book {
  id: string;
  title: string;
  autor: string;
  content: string;
  userId: string;
}

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const {user,logout,signInWithGoogle} = useAuth()

  useEffect(() => {
    
    async function fetchBooks() {
      const querySnapshot = await getDocs(collection(db, "books"));

      const booksArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Book, "id">),
      }));

      setBooks(booksArray);
    }

    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Todos os Livros</h1>
           <nav className={styles.mynav}>  
          {user ? <Link href="/dashboard" className={styles.link}>Criar Livro</Link>: ""}
          {user ? <Link href="/profile" className={styles.link}>Perfil</Link>: ""}
          {user ? <li className={styles.myLi} onClick={logout}>Sair</li>: ""}
          </nav>
      {books.map((book) => (
        <div key={book.id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <h3>{book.title}</h3>
          <p><strong>Autor:</strong> {book.autor}</p>
          <p>{book.content}</p>
        </div>
      ))}
               <button onClick={signInWithGoogle}>Entrar com o google </button> 
    </div>
  );
}
