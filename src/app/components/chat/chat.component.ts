import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
  ]
})
export class ChatComponent {

  mensaje: string = "";
  elemento : any;

  constructor(public _cs:ChatService) { 
    this._cs.cargarMensajes().subscribe(() => {

      let elem=document.getElementById("app-mensajes");
 
      setTimeout(()=>{
        elem.scrollTop = elem.scrollHeight;
      },20);
      
    });
  }

  enviar(){

    if( this.mensaje.length === 0 ){
      return
    }

    this._cs.addMensaje(this.mensaje)
      .then(() => this.mensaje = "" )
      .catch( (err) => console.error('No se pudo enviar',err))
    
  }

}
