"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/service/connect";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/components/HookProtection";
interface BookData {
  title: string;
  content: string;
}
export default function EditBook() {
 const { id } = useParams<{ id: string }>();
  const {user,loading} = useAuth()
   const [title, setTitle] = useState("")
   const [content, setContent] = useState("")
      const router = useRouter()

      async function handleUpdate() {
      try {
        await updateDoc(doc(db,"books",id), {
          title,
          content,
        })
          router.push("/profile");
      }   catch (erro) {
    console.log(erro)
  }
  
  } 
 const fetchBooks = async () => {


      const docRef = doc(db, "books",id)
      const docSnap = await getDoc(docRef)
         if(!user) {
    return  router.push("profile")
   }
      if(!docSnap.exists()) {
           router.push("profile")
      }

      const data = docSnap.data() as BookData
      setTitle(data.title ?? "")
      setContent(data.content ??"")
 }

 useEffect(() => {
fetchBooks()
 },[])
if(loading) {
  return <div>Carregando</div>
}
return (
  <div>
    <label >Titulo
       <input type="text" placeholder="digite seu titulo" value={title} onChange={(e)=> setTitle(e.target.value)} />
    </label>
    
   <label >Conteudo 
       <input type="text" placeholder="digite seu conteudo" value={content} onChange={(e)=> setContent(e.target.value)}/>
    </label>
          <button onClick={handleUpdate}>Salvar</button>
  </div>
)


}