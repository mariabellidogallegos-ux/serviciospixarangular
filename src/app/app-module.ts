import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MenuComponent } from './components/menu-component/menu-component';
import { HomeComponent } from './components/home-component/home-component';
import { PersonajesComponent } from './components/personajes-component/personajes-component';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { ServicePersonajes } from './services/service.personajes';
import { CreatePersonajeComponent } from './components/create-personaje-component/create-personaje-component';
import { DeleteFromComponent } from './components/delete-from-component/delete-from-component';

@NgModule({
  declarations: [
    App,
    MenuComponent,
    HomeComponent,
    PersonajesComponent,
    CreatePersonajeComponent,
    DeleteFromComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners(), ServicePersonajes, provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
