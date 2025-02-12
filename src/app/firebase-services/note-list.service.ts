import { Injectable, inject } from '@angular/core';
import { Firestore, collection,addDoc , doc, updateDoc, deleteDoc , onSnapshot} from '@angular/fire/firestore';
import { async, Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
   trashNotes: Note[] = [];
   normalNotes: Note[] = [];

   unsubTrash;   
   unsubNotes;
   test: boolean = false;

   firestore: Firestore = inject(Firestore);
  normalNotes$: any;

  constructor() {
    this.unsubNotes = this.subNoteList();
    this.unsubTrash = this.subTrashList();
  }

  async deleteNote(colId: "notes" | "trash", docId: string){
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err: any) => {console.log(err)}
    )
  }

  async updateNote(note: Note){
    if(note.id){
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note),note.id)
      await updateDoc(docRef,this.getCleanJson(note)).catch(
        (err) => {console.log(err); }
      ).then()
    }
  }

  getCleanJson(note:Note):{}{
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  getColIdFromNote(note:Note){
    if(note.type == 'note'){
      return 'notes';
    } else {
      return 'trash'
    }
  }

  async addNote(item: Note, colId: "note" | "trash"){
    await addDoc(this.getNotesRef(),item).catch(
      (err) => {console.error(err);
      }
    ).then(
      (docRef) => {console.log("Document written with ID: ", docRef?.id);}
    )

  }

  ngonDestroy(){
    this.unsubNotes();
    this.unsubTrash();
  }

  subTrashList(){
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(),element.id));
      })
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }

  
  subNoteList(){
   return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
        console.log(this.normalNotes);
        this.test = true;

      })
    });
  }

  getNotesRef(){
    return collection(this.firestore, 'notes');
  }

  getTrashRef(){
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colID: string, docID: string) {
    return doc(this.firestore, colID, docID);
  }
}
