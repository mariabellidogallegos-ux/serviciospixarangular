import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home-component/home-component';
import { PersonajesComponent } from './components/personajes-component/personajes-component';
import { CreatePersonajeComponent } from './components/create-personaje-component/create-personaje-component';
import { DeleteFromComponent } from './components/delete-from-component/delete-from-component';




const routes: Routes = [
  {path: "", component: HomeComponent },
  {path: "personajes", component: PersonajesComponent },
  {path: "create", component: CreatePersonajeComponent },
  {path: "delete", component: DeleteFromComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }