import * as pageActions  from './page.actions';
import { FullPage } from 'src/app/models/fullPage';



export interface State {
    availablePages: FullPage[],
    isLoading : boolean

}

const intialState : State = {
    availablePages: [],
    isLoading : false

};


export function pageReducer (state = intialState , action : pageActions.pageActions){

    switch(action.type){

        case pageActions.POST_PAGE:
        case pageActions.UPDATE_PAGE_WITH_IMAGE:
        case pageActions.UPDATE_PAGE:
        case pageActions.GENERATE_PAGE:
            return {...state  , isLoading : true };

        case pageActions.SAVE_PAGE:
        case pageActions.SAVE_GENERATED_PAGE:
            return {...state , availablePages : [...state.availablePages , action.payload] , isLoading : false}

        case pageActions.SAVE_UPDATE:
           { 
            let updatePages = [...state.availablePages];
            const index = updatePages.findIndex(item => item.id === action.payload.id);
            if(index !== -1){

                updatePages[index] = action.payload;
            } 
            return {...state , availablePages : [...updatePages] , isLoading : false}
        }

        case pageActions.FETCH_PAGES: 
             return {...state , isLoading : true}

        case pageActions.LOAD_PAGES: 
             return {...state , availablePages: action.payload  , isLoading : false}

        case pageActions.DELETE_PAGE:
            const pages = state.availablePages.filter(page => page.id !== action.payload.id);           
            return {...state  , availablePages: pages  , isLoading : true }

        case pageActions.CLEAR_LOADING:
            return {...state , isLoading : false}
        default:
            return state;
    }
}

