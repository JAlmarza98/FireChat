import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { map } from 'rxjs/operators'

import { Mensaje } from '../interface/mensaje.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor( private afs:AngularFirestore,
               private auth: AngularFireAuth) {

    this.auth.authState.subscribe( user => {
      
      if(!user){
        return
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    })

  }

  login( proveedor: string ) {

    if( proveedor === 'google'){
      this.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }else{
      this.auth.signInWithPopup(new auth.TwitterAuthProvider());
    }
    
  }

  logout() {
    this.usuario = {};
    this.auth.signOut();
  }

  cargarMensajes(){

    this.itemsCollection = this.afs.collection<Mensaje>('chat', ref => ref.orderBy('fecha', 'desc').limit(50));

    return this.itemsCollection.valueChanges().pipe(
      map( 
        mensajes => {
          this.chats = [];
          for ( let mensaje of mensajes){
            this.chats.unshift( mensaje );
          }
          return this.chats
        }
      )
    ); 

  }

  addMensaje( texto: string ){

    let mensaje: Mensaje = {
      nombre  : this.usuario.nombre,
      mensaje : texto,
      fecha   : new Date().getTime(),
      uid     : this.usuario.uid
    }

    return this.itemsCollection.add( mensaje );

  }

}
