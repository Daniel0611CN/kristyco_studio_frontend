import { Component, inject, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { Usuario } from '../../../models/interfaces/entities/usuario.interface';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  usuarioService = inject(UsuarioService);
  storageService = inject(StorageService);

  usuario: Usuario = {
    id: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  ngOnInit(): void {
    this.usuarioService.get(this.storageService.getUser().id).subscribe((usuario: Usuario) => {
      this.usuario = usuario;
      console.log(this.usuario);
    });
  }

}
