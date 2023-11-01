import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ContentService } from 'src/app/services/content.service';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-single-hero',
  templateUrl: './single-hero.component.html',
  styleUrls: ['./single-hero.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class SingleHeroComponent {
  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  public subscription:any;
  public id:any;
  public hero:any=[];

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getHero();
  }

  async getHero(){
    this.subscription = this.contentService.getHero(this.id).subscribe((res:any)=> {
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
  templateUrl: '../home/home.dialog.html',
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
          window.location.assign('/');
        }
    )}
  
}
