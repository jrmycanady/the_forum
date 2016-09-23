import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute }       from '@angular/router';

import { DataService } from './services/data.service';

@Component({
    selector: 'tf-app',
    template: `
      
      <router-outlet></router-outlet>
        
      
    `,
    providers: [
      // DataService
    ]
    
    

})
export class AppComponent {
  tool: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public location: Location,
    public dataService: DataService) {

  }

}
