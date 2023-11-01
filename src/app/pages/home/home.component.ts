import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgFor, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentService } from 'src/app/services/content.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [ NgFor, CommonModule, RouterModule, MatIconModule, MatButtonModule, MatDialogModule, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule],
})
export class HomeComponent {

  constructor(
    private contentService: ContentService,
    public dialog: MatDialog
  ) {}

  public heroes:any=[];
  public subscription:any;
  public paginationStart:number=0;
  public paginationEnd:number=8;
  public loading:boolean=true;

  public searchForm:FormGroup = new FormGroup({
    searchValue:     new FormControl(''),
  });

  ngOnInit() {
    this.getHeroes();
  }

  searchHero(){
    this.loading = true;
    if(this.searchValue?.value == ''){
      this.getHeroes();
    } else {
      let byName      = this.contentService.filterByName(this.searchValue?.value);
      let byNickName  = this.contentService.filterByNickName(this.searchValue?.value); 

      forkJoin([byName, byNickName])
      .pipe(map(data => data.reduce((result:any,arr:any)=>[...result,...arr],[])))
      .subscribe(data =>{

        this.heroes = data;
        this.loading = false;
      
      });
    }
  }

  get searchValue(){
    return this.searchForm.get('searchValue');
  }

  async getHeroes(){
    this.subscription = this.contentService.getHeroes().subscribe((res:any)=> {
      this.heroes = res;
      this.loading = false;
    });
  }

  getImage(id:string,picture:string){
    return this.contentService.getImage(id,picture);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  // Pagination functions

  checkPagination(i:number){
    let page = 0;
    let res = i % 8;

    if(res == 0){
      page = i/8;
    }
    return page;
  }

  getLastPage(){
    return Math.ceil(this.heroes.length/8);
  }

  changePage(i:number){
    this.paginationStart = i-8;
    this.paginationEnd = i;
  }

  lastPagination(){
    let prevElements = Math.floor(this.heroes.length/8);
    this.paginationStart = prevElements*8;
    this.paginationEnd = this.heroes.length;
  }

  nextPagination(){
    this.paginationStart += 8;
    this.paginationEnd += 8;
  }

  prevPagination(){
    let totalElements = this.paginationEnd - this.paginationStart;
    if(totalElements < 7){
      this.paginationEnd = this.paginationEnd - totalElements;
      this.paginationStart = this.paginationEnd-8;
    } else {
      this.paginationStart -= 8;
      this.paginationEnd -= 8;
    }
  }

  // DIALOG
  openDialog(enterAnimationDuration:string, exitAnimationDuration:string, nickname:string, id:string): void {
    this.dialog.open(HomeDialog, {
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
  selector: 'home-dialog',
  templateUrl: 'home.dialog.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class HomeDialog {
  constructor(
    private contentService: ContentService,
    @Inject(MAT_DIALOG_DATA) public data: {nickname:string, id:string},
    public dialogRef: MatDialogRef<HomeDialog>) {}

    public loading:boolean=false;

    deleteHero(id:string){
      this.loading=true;
      this.contentService.deleteHero(id).subscribe(
        res => {
          window.location.reload();
        }
    )}
  
}
