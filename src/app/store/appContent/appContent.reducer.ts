import * as appContentActions  from './appContent.actions';
import { act } from '@ngrx/effects';



export interface State {
    currentContent: any[],
    isLoading : boolean
    popupImage : {id: string , imageUrl : string}

}

const intialState : State = {
    currentContent: [],
    isLoading : false,
    popupImage :  {id: '' , imageUrl : ''}


};


export function appContentReducer (state = intialState , action : appContentActions.appContentActions){


    switch(action.type){

        case appContentActions.ADD_CONTENT:
            let updated = [];
            if(state.currentContent === null){
                updated.push(action.payload)
            } else {
                updated = [...state.currentContent];
                const index = state.currentContent.findIndex(item => item.id === action.payload.id);
                if (index > -1){
                    updated[index] = action.payload;
                } else {
                    updated = [...updated , action.payload]
                }
                
            }

            return {...state  , currentContent : updated  ,isLoading : false };

        case appContentActions.SAVE_CONTENT_IN_DB:
            return {...state  , currentContent : action.payload , isLoading : true}

        case appContentActions.FETCH_CONTENT:
        case appContentActions.UPDATE_ALL:
             return {...state , isLoading : true}

        case appContentActions.LOAD_CONTENT: 
             return {...state , currentContent: action.payload  , isLoading : false}

        case appContentActions.REMOVE_CONTENT:
            const content = state.currentContent.filter((content) => content.id !== action.payload);           
            return {...state  , currentContent: content  }
        
        case appContentActions.ADD_POPUP:
            return { ...state , popupImage : action.payload}
        case appContentActions.CLEAR_LOADING:
            return {...state , isLoading : false}
        default:
            return state;
    }
}

