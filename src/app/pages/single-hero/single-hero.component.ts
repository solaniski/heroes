import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../../layouts/header/header.component';
import { Subscription } from 'rxjs';
import { Hero } from '../../models/heromodel';

@Component({
  selector: 'app-single-hero',
  templateUrl: './single-hero.component.html',
  styleUrls: ['./single-hero.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent]
})
export class SingleHeroComponent implements OnInit, OnDestroy{
  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  public subscription:Subscription = new Subscription;
  public id:string='';
  public hero:Hero | null = null;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.getHero();
  }

  async getHero(){
    this.subscription = this.contentService.getHero(this.id).subscribe((res:Hero)=> {
      this.hero = res;
    });
  }

  getImage(id:string,picture:string){
    return this.contentService.getImage(id,picture);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
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
  templateUrl: '../home/home.dialog.html',
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
      this.loading=true;
      this.contentService.deleteHero(id).subscribe(
        () => {
          window.location.assign('/');
        }, 
        (error) => {
          console.error('Error deleting hero:', error);
        }
    )}
  
}
