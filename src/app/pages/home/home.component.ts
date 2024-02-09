import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { LoadingService } from '../../services/loading.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Observable, map, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Hero } from '../../models/heromodel';
import { HeaderComponent } from '../../layouts/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [ 
    NgFor, 
    NgIf,
    CommonModule, 
    RouterModule, 
    MatIconModule, 
    MatButtonModule, 
    MatDialogModule, 
    MatProgressSpinnerModule,
    MatPaginator,
    HeaderComponent
  ],
})
export class HomeComponent implements OnInit {

  constructor(
    private contentService: ContentService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  public query:string='';
  public heroes$!:Observable<Hero[]>;
  public paginationStart:number=0;
  public paginationEnd:number=8;
  public loading:boolean=true;
  public total:number=0;
  public pageSize=8;
  public currentPage=1;
  public formValue='';

  ngOnInit() {

    this.loadingService.loading$.subscribe(loading => {
      this.loading = loading;
    });

    this.query = this.route.snapshot.params['q'];
    if(this.query){
      this.formValue = this.query;
    }
    this.searchHero();
  }

  getFormAction(evt:string){
    this.currentPage = 1;
    this.formValue = evt;
    this.searchHero();
  }

  searchHero(){
    if(this.formValue == ''){
      this.getHeroes();
    } else {
      this.heroes$ = this.contentService.searchHero(this.formValue).pipe(
        tap(res => {
          this.total = res.length;
        }),
        map(heroes => heroes.slice((this.pageSize*this.currentPage)-this.pageSize,this.pageSize*this.currentPage))
      )
    }
  }

  


  getHeroes() {
    this.heroes$ = this.contentService.getHeroes(this.currentPage, this.pageSize)
      .pipe(
        tap(res => {
          this.total = res.items;
        }),
        map(res => res.data)
      )
  }

  // Función que nos ayuda a manejar el uso del paginador de angular material
  pageChanged(e: PageEvent) {
    this.currentPage = e.pageIndex+1;
    this.searchHero();
  }

  getImage(id:string,picture:string){
    return this.contentService.getImage(id,picture);
  }

  // DIALOG
  openDialog(enterAnimationDuration:string, exitAnimationDuration:string, nickname:string, id:string): void {
    this.dialog.open(HomeDialogComponent, {
      data: {
        nickname: nickname,
        id: id
      },
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

}

@Component({
  selector: 'app-dialog',
  templateUrl: 'home.dialog.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class HomeDialogComponent {
  constructor(
    private contentService: ContentService,
    @Inject(MAT_DIALOG_DATA) public data: {nickname:string, id:string},
    public dialogRef: MatDialogRef<HomeDialogComponent>) {}

    public loading:boolean=false;

    deleteHero(id:string){
      this.contentService.deleteHero(id).subscribe(
        () => {
          window.location.reload();
        }, 
        (error) => {
          console.error('Error deleting hero:', error);
        }
    )}
  
}
