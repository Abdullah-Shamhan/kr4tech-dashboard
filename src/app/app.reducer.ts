import * as pageReducer from './store/pages/page.reducer'
import { ActionReducerMap } from '@ngrx/store'
import * as newPageReducer from './store/addPage/newPage.reducer'
import * as articlesReducer from './store/articles/articles.reducer'
import * as slidersReducer from './store/sliders/sliders.reducer'
import * as appContentReducer from './store/appContent/appContent.reducer'

export interface appState {
    page: pageReducer.State
    addPage: newPageReducer.State,
    articles : articlesReducer.State,
    sliders : slidersReducer.State,
    appContent : appContentReducer.State

}

export const appReducer: ActionReducerMap<appState> = {
    page: pageReducer.pageReducer,
    addPage: newPageReducer.NewPageReducer,
    articles : articlesReducer.articlesReducer,
    sliders : slidersReducer.slidersReducer,
    appContent: appContentReducer.appContentReducer
}


