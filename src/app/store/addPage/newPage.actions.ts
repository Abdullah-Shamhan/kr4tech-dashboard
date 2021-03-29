import { Action} from '@ngrx/store';
import { Page } from 'src/app/models/page';


export const ADD_PAGE = "ADD_PAGE";
export const INVALID_PAGE = "INVALID_PAGE";
export const ADD_PAGE_CONTENT = "ADD_PAGE_CONTENT";
export const START_UPLOADING = 'START_UPLOADING';
export const FINISH_UPLOADING = 'FINISH_UPLOADING';



export class addPage implements Action {
    readonly type = ADD_PAGE;

    constructor(public payload : Page){}
}

export class addPageContent implements Action {
    readonly type = ADD_PAGE_CONTENT;

    constructor(public payload : any[]){}
}

export class invalidPage implements Action {
    readonly type = INVALID_PAGE;

    constructor(){}
}

export class startUploading implements Action {
    readonly type = START_UPLOADING;

    constructor(){}
}

export class finishUploading implements Action {
    readonly type = FINISH_UPLOADING;

    constructor(){}
}





export type addPageActions = addPage| addPageContent | invalidPage | startUploading | finishUploading;