import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { filter, map } from 'rxjs/operators';
import { Subscription, zip } from 'rxjs';
import { Hero } from '../../models/heromodel';
import { ContentService } from '../../services/content.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeaderComponent } from '../../layouts/header/header.component';

@Component({
  selector: 'app-hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatIconModule, 
    CommonModule, 
    RouterModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatProgressSpinnerModule,
    HeaderComponent
  ]
})
export class HeroFormComponent implements OnInit, OnDestroy {

  constructor(
    private contentService: ContentService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  public selectedFile: File | null = null;
  public FileUrl:string = "";

  public success:boolean  = false;
  public loading:boolean  = false;
  public error:boolean    = false;
  public errorText:string = "";
  public id:string        = "";
  public pageType:string  = ""; 
  public pageTitle:string = "";
  public subscription: Subscription = new Subscription;

  public heroForm:FormGroup = new FormGroup({
    nickname:     new FormControl('', [Validators.required, Validators.maxLength(35)]),
    name:         new FormControl(''),
    description:  new FormControl('')
  });

  ngOnInit(){
    this.checkPageType();
    zip(this.heroForm.statusChanges, this.heroForm.valueChanges).pipe(
      filter(([state]) => state == 'VALID'),
      map(([value]) => value),
    ).subscribe();
  }

  async saveHero(){
    this.loading = true;
    if(this.heroForm.status == 'VALID'){
      const hero:Hero = new Hero(this.formatSlug(this.nickname?.value),this.capitalize(this.nickname?.value),this.capitalize(this.name?.value),this.FileUrl,this.description?.value);
      if(this.pageType == 'edit'){
        this.contentService.editHero(hero,this.id).subscribe(
          {
            next: () => {},
            error: (e) => {
              this.loading    = false;
              this.error      = true;
              this.errorText  = e;
            },
            complete: () => {
              this.success = true;
              this.router.navigate(['/']);
            }
          }
          );
      } else {
        this.contentService.addHero(hero).subscribe(
          {
            next: () => {},
            error: (e) => {
              this.loading    = false;
              this.error      = true;
              this.errorText  = e;
            },
            complete: () => {
              this.success = true;
              this.router.navigate(['/']);
            }
          }
          );
      }
    }
  }

  get name(){
    return this.heroForm.get('name');
  }

  get nickname(){
    return this.heroForm.get('nickname');
  }

  get description(){
    return this.heroForm.get('description');
  }

  checkPageType(){
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if(this.id){
      this.pageType   = "edit";
      this.pageTitle  = "Edit Hero";
      this.loading    = true;
      this.getHero();
    } else{ 
      this.pageType   = "add";
      this.pageTitle  = "Add a new hero";
    }
  }

  async getHero(){
    this.subscription = this.contentService.getHero(this.id).subscribe((res:Hero)=> {
      this.heroForm.controls['nickname'].setValue(res.nickname);
      this.heroForm.controls['name'].setValue(res.name);
      this.heroForm.controls['description'].setValue(res.description);
      this.FileUrl = res.picture;
      this.loading = false;
    });
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
        const selectedFile = inputElement.files[0];
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            this.FileUrl = reader.result?.toString() ?? '';
        });

        reader.readAsDataURL(selectedFile);
    }
}

  getImage(id:string,picture:string){
    return this.contentService.getImage(id,picture);
  }

  formatSlug(str:string){
    str = str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
    return str;
  }

  capitalize(str:string){
    const result = new TitleCasePipe().transform(str);
    return result;
  }

  ngOnDestroy(){
    if(this.pageType == 'edit'){
      this.subscription.unsubscribe();
    }
  }

}
