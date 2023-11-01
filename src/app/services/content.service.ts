import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hero } from '../models/heromodel';

@Injectable({
  providedIn: 'root',
})


export class ContentService {
  constructor(
    private http: HttpClient
    ) {}

  getHeroes(): Observable<Hero>{
    let heroes: Observable<any> = this.http.get('/api/heroes');
    return heroes;
  }

  getHero(id:string): Observable<Hero>{
    let hero: Observable<any> = this.http.get('/api/heroes/'+id);
    return hero;
  }

  filterByName(search:string): Observable<Hero>{
    let heroes: Observable<any> = this.http.get('/api/heroes?name_like='+search);
    return heroes;
  }

  filterByNickName(search:string): Observable<Hero>{
    let heroes: Observable<any> = this.http.get('/api/heroes?nickname_like='+search);
    return heroes;
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>('/api/heroes', hero);
  }

  editHero(hero: Hero, id:string): Observable<Hero> {
    return this.http.put<Hero>('/api/heroes/'+id, hero);
  }

  deleteHero(id:string){
    return this.http.delete('/api/heroes/'+id);
  }

  getImage(id:string,picture:string){
    let image;
    if(picture == '' || picture == null){
      if(id){
        image = "assets/images/heroes/"+id+".jpg";
      } else {
        image = "assets/images/heroes/generic.jpg";
      }
      
    } else {
      image = picture;
    }
    return image;
  }

}