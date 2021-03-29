import { Page } from 'src/app/models/page';
import * as pageActions  from './newPage.actions';



export interface State {
    page: Page,
    content: any[],
    pageIsValid: boolean,
    isUploading : boolean
}

const intialState : State = {
    page: null,
    content: [],
    pageIsValid: false,
    isUploading : false
};


export function NewPageReducer (state = intialState , action : pageActions.addPageActions){

    switch(action.type){
        case pageActions.ADD_PAGE:
            return {...state , page: action.payload , content : null , pageIsValid : true  };

        case pageActions.ADD_PAGE_CONTENT:
            return {...state , content: action.payload }

        case pageActions.INVALID_PAGE:
            return {...state , page : null , content: null ,  pageIsValid : false }
        
        case pageActions.START_UPLOADING: 
            return {...state , isUploading : true }
        
        case pageActions.FINISH_UPLOADING: 
            return {...state , isUploading : false }

        default:
            return state;
    }
}

