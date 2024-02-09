import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, 
    ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.searchForm.get('searchValue')?.setValue(this.formValue);
  }

  @Input() formValue:string='';
  @Output() formValueChange: EventEmitter<string> = new EventEmitter<string>();
  
  public isOpen=false;
  public path = this.route.snapshot.routeConfig?.path
  public searchForm:FormGroup = new FormGroup({
    searchValue:     new FormControl(''),
  });

  get searchValue(){
    return this.searchForm.get('searchValue');
  }

  formAction(){
    const searchValue = this.searchValue?.value || '';
    this.formValueChange.emit(searchValue);
    if(this.path){
      this.router.navigate(['/search/'+searchValue]);
    }
  }

}
