import { Action} from '@ngrx/store';
import { Page } from 'src/app/models/page';
import { FullPage } from 'src/app/models/fullPage';


export const POST_PAGE = "POST_PAGE";
export const SAVE_PAGE = 'SAVE_PAGE';
export const FETCH_PAGES = "FETCH_PAGES";
export const LOAD_PAGES = 'LOAD_PAGES';
export const DELETE_PAGE = 'DELETE_PAGE';
export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_PAGE_WITH_IMAGE = 'UPDATE_PAGE_WITH_IMAGE';
export const AFTER_UPDATE = 'AFTER_UPDATE';
export const SAVE_UPDATE = 'SAVE_UPDATE';
export const CLEAR_LOADING = 'CLEAR_LOADING';
export const GENERATE_PAGE = 'GENERATE_PAGE';
export const SAVE_GENERATED_PAGE = 'SAVE_GENERATED_PAGE';


export class postPage implements Action {
    readonly type = POST_PAGE;

    constructor(public payload : {page: Page , content: any[]} ){}
}

export class savePage implements Action {
    readonly type = SAVE_PAGE;

    constructor(public payload : FullPage ){}
}

export class saveGeneratedPage implements Action {
    readonly type = SAVE_GENERATED_PAGE;

    constructor(public payload : FullPage ){}
}

export class generatePage implements Action {
    readonly type = GENERATE_PAGE;

    constructor(public payload : FullPage ){}
}

export class saveUpdate implements Action {
    readonly type = SAVE_UPDATE;

    constructor(public payload : FullPage ){}
}

export class afterUpdate implements Action {
    readonly type = AFTER_UPDATE;

    constructor(public payload : FullPage ){}
}

export class fetchPages implements Action {
    readonly type = FETCH_PAGES;

    constructor(){}
}

export class loadPages implements Action {
    readonly type = LOAD_PAGES

    constructor(public payload : FullPage[] ){}
}

export class deletePage implements Action {
    readonly type = DELETE_PAGE;

    constructor(public payload :{ id : string , withImages : boolean} ){}
}

export class clearLoading implements Action {
    readonly type = CLEAR_LOADING;

    constructor(){}
}

export class updatePageWithImage implements Action {
    readonly type = UPDATE_PAGE_WITH_IMAGE;

    constructor(public payload : {page: FullPage , image: File}){}
}

export class updatePage implements Action {
    readonly type = UPDATE_PAGE;

    constructor(public payload : FullPage ){}
}




export type pageActions = postPage| fetchPages | savePage | loadPages | deletePage | 
clearLoading | updatePage | updatePageWithImage | saveUpdate | afterUpdate | generatePage | saveGeneratedPage;