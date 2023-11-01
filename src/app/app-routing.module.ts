import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HeroFormComponent } from './pages/hero-form/hero-form.component';
import { SingleHeroComponent } from './pages/single-hero/single-hero.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'add-hero',
    component: HeroFormComponent
  },
  {
    path: 'hero/:id',
    component: SingleHeroComponent
  },
  {
    path: 'edit-hero/:id',
    component: HeroFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
