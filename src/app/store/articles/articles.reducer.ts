import { Article } from 'src/app/models/article';
import * as articlesActions from './articles.actions'


export interface State {
    availableArticles: Article[],
    isLoading : boolean

}

const intialState : State = {
    availableArticles: [],
    isLoading : false

};


export function articlesReducer (state = intialState , action : articlesActions.articlesActions){

    switch(action.type){

        case articlesActions.ADD_ARTICLE:

            const index = state.availableArticles.findIndex(item => item.id === action.payload.id);
            let updatedArticles = [...state.availableArticles];

            if(index > -1){
                updatedArticles[index] = action.payload;
            }  else {
                updatedArticles = [...state.availableArticles , action.payload];
            }

            return {...state  , availableArticles : [...updatedArticles] , isLoading : false };
        case articlesActions.STORE_ARTICLE:
        case articlesActions.UPDATE_ARTICLE:
            return {...state  ,  isLoading : true };

        case articlesActions.FETCH_ARTICLES:
            return {...state  ,  isLoading : true };
            
        case articlesActions.SET_ARTICLES:
            return {...state  , availableArticles :action.payload , isLoading : false  };
        case articlesActions.DELETE_ARTICLE:
            const updatedArticle = state.availableArticles.filter(item => item.id !== action.payload);

            return {...state , availableArticles : updatedArticle , isLoading : true}
        case articlesActions.CLEAR_LOADING:
            return {...state , isLoading : false}
        default:
            return state;
    }
}

