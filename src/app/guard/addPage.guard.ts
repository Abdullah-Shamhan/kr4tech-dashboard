import { Injectable } from "@angular/core";
import { CanActivate,  UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import { take, map } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class addPageGuard implements CanActivate {

    constructor(private router: Router , private store: Store<fromApp.appState>){}

canActivate(): 
            boolean | UrlTree | Promise<  boolean | UrlTree> | Observable<  boolean | UrlTree> {

                return this.store.select('addPage').pipe(take(1), map(state => state.pageIsValid) , map(isValid => {
                    
                    if (isValid){
                       
                        return true;

                     } else {
                        return false;

                     }
                        



                }));
            }

}