import { Action} from '@ngrx/store';


export const ADD_CONTENT = "ADD_CONTENT";
export const SAVE_CONTENT_IN_DB = "SAVE_CONTENT_IN_DB";
export const REMOVE_CONTENT = 'REMOVE_CONTENT';
export const FETCH_CONTENT = "FETCH_CONTENT";
export const LOAD_CONTENT = 'LOAD_CONTENT';
export const CLEAR_LOADING = 'CLEAR_LOADING';
export const ADD_POPUP = 'ADD_POPUP';
export const REMOVE_POPUP = 'REMOVE_POPUP';
export const GET_CURRENT_POPUP = 'GET_CURRENT_POPUP';
export const UPDATE_ALL = 'UPDATE_ALL';

export class addContent implements Action {
    readonly type = ADD_CONTENT;

    constructor(public payload : any ){}
}

export class updateAll implements Action {
    readonly type = UPDATE_ALL;

    constructor(){}
}



export class saveContentInnDb implements Action {
    readonly type = SAVE_CONTENT_IN_DB;

    constructor(public payload :  any[] ){}
}

export class fetchContent implements Action {
    readonly type = FETCH_CONTENT;

    constructor(){}
}

export class loadContent implements Action {
    readonly type = LOAD_CONTENT

    constructor(public payload : any[] ){}
}

export class removeContent implements Action {
    readonly type = REMOVE_CONTENT;

    constructor(public payload : string ){}
}

export class clearLoading implements Action {
    readonly type = CLEAR_LOADING;

    constructor(){}
}



export class addPopup implements Action {
    readonly type = ADD_POPUP;

    constructor(public payload : {id : string , imageUrl: string}){}
}


export class getCurrentPopup implements Action {
    readonly type = GET_CURRENT_POPUP;

    constructor(){}
}



export type appContentActions = addContent| fetchContent | saveContentInnDb | loadContent | 
removeContent | clearLoading | addPopup | getCurrentPopup | updateAll ;