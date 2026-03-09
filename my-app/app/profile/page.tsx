"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs,deleteDoc,doc } from "firebase/firestore";
import { db } from "@/app/service/connect";
import { useAuth } from "@/app/components/HookProtection"
import { useRouter } from "next/navigation";
import Link  from "next/link";

interface Book {
  id: string;
  title: string;
  autor: string;
  content: string;
  userId: string;
}

export default function Profile() {
  const { user, loading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);

  const router = useRouter();
  function handleEdit(id: string) {
  router.push(`/books/edit/${id}`);
}
  async function handleDelete(id: string) {
  try {
    await deleteDoc(doc(db, "books", id));

   
    setBooks((prevBooks) =>
      prevBooks.filter((book) => book.id !== id)
    );

  } catch (error) {
    console.error(error);
  }
}

  useEffect(() => {
    async function fetchUserBooks() {
      if (!user) return;

      const q = query(
        collection(db, "books"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);

      const booksArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Book, "id">),
      }));

      setBooks(booksArray);
    }

    fetchUserBooks();
  }, [user]);

  if (loading) return <p>Carregando...</p>;
  if (!user) return <p>Você precisa estar logado</p>;

  return (
    <div>
      <h1>Meus Livros</h1>
      <Link href="/">Voltar para a home</Link>
     {books.map((book) => (
  <div key={book.id}>
    <h3>{book.title}</h3>

    {user?.uid === book.userId && (
      <>
        <button onClick={() => handleEdit(book.id)}>
          Editar
        </button>

        <button onClick={() => handleDelete(book.id)}>
          Excluir
        </button>
      </>
    )}
  </div>
))}

    </div>
  );
}
