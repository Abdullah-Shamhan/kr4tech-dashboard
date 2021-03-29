import { Action} from '@ngrx/store';
import { Article } from 'src/app/models/article';


export const ADD_ARTICLE = "ADD_ARTICLE";
export const STORE_ARTICLE = "STORE_ARTICLE";
export const FETCH_ARTICLES = "FETCH_ARTICLES";
export const SET_ARTICLES = "SET_ARTICLES";
export const DELETE_ARTICLE = "DELETE_ARTICLE";
export const CLEAR_LOADING = "CLEAR_LOADING";
export const UPDATE_ARTICLE = "UPDATE_ARTICLE";


export class addArticle implements Action {
    readonly type = ADD_ARTICLE;

    constructor(public payload : Article ){}
}

export class storeArticle implements Action {
    readonly type = STORE_ARTICLE;

    constructor(public payload : Article ){}
}

export class updateArticle implements Action {
    readonly type = UPDATE_ARTICLE;

    constructor(public payload : Article ){}
}

export class fetchArticles implements Action {
    readonly type = FETCH_ARTICLES;

    constructor(){}
}


export class setArticles implements Action {
    readonly type = SET_ARTICLES;

    constructor(public payload : Article [] ){}
}

export class deleteArticle implements Action {
    readonly type = DELETE_ARTICLE;

    constructor(public payload : string ){}
}

export class clearLoading implements Action {
    readonly type = CLEAR_LOADING;

    constructor(){}
}



export type articlesActions = addArticle | storeArticle | fetchArticles | setArticles | deleteArticle | clearLoading | updateArticle;