import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Personaje } from "../models/personaje";
import { environment } from "../../environments/environment.development";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ServicePersonajes {
  constructor(
    private _http: HttpClient
  ) {}

  async getPersonajesAsync(): Promise<Personaje[]> {
    let request = "api/Pixar";
    let url = environment.apipixar + request;
    return firstValueFrom(
      this._http.get<Personaje[]>(url)
    );
  }

  async insertPersonaje(personaje: Personaje): Promise<any> {
 let request = "api/Pixar"
 let url = environment.apipixar + request
 let header = new HttpHeaders().set("content-type", "application/json")
 return firstValueFrom(
 this._http.post(url, personaje, {headers: header})
 )
 }

   async deletePersonaje(id: number): Promise<any> {
 let request = "api/Pixar/" + id;
 let url = environment.apipixar + request;
 return firstValueFrom(
 this._http.delete(url)
 )
 }



  
}