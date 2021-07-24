import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {
  listTarjetas: any[] = [];
  accion = 'Agregar';
  form: FormGroup;
  id: number | undefined;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private _tarjetaService: TarjetaService) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
    })
   }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas() { 
    this._tarjetaService.getListTarjetas().subscribe(data => {
      this.listTarjetas = data;
    }, error => {
      console.log(error);
      this.toastr.error('Ocurrió un error', 'Error');
    })
  }

  guardarTarjeta(){
    const tarjeta: any = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value
    }

    if(this.id == undefined){
      // Agregar nueva tarjeta
      this._tarjetaService.saveTarjeta(tarjeta).subscribe(data => {
        this.toastr.success('La tarjeta fue registrada con exito', 'Tarjeta registrada');
        this.obtenerTarjetas();
        this.form.reset();
      }, error => {
        console.log(error);
        this.toastr.error('Ocurrió un error', 'Error');
      })
    }else{
      // Editamos tarjeta
      tarjeta.id = this.id;
      this._tarjetaService.updateTarjeta(this.id, tarjeta).subscribe(data => {
        this.form.reset();
        this.accion = 'Agregar';
        this.id = undefined;
        this.toastr.info('La tarjeta fue actualizada con éxito', 'Tarjeta actualizada');
        this.obtenerTarjetas();
      }, error => {
        console.log(error);
        this.toastr.error('Ocurrió un error', 'Error');
      })
    }


  }

  eliminarTarjeta(index: number){
    this._tarjetaService.deleteTarjeta(index).subscribe(data => {
      this.toastr.success('La tarjeta fue eliminada con exito', 'Tarjeta eliminada');
      this.obtenerTarjetas();
    }, error => {
      console.log(error);
      this.toastr.error('Ocurrió un error', 'Error');
    });
  }

  editarTarjeta(tarjeta: any){
    this.accion = 'Editar';
    this.id = tarjeta.id;

    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv
    })
    console.log(tarjeta);
  }

}
