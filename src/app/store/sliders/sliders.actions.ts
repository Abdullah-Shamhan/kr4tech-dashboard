import { Action} from '@ngrx/store';
import { Slider } from 'src/app/models/slider';


export const POST_SLIDER = "POST_SLIDER";
export const SAVE_SLIDER = 'SAVE_SLIDER';
export const FETCH_SLIDERS = "FETCH_SLIDERS";
export const LOAD_SLIDERS = 'LOAD_SLIDERS';
export const DELETE_SLIDER = 'DELETE_SLIDER';
export const CLEAR_LOADING = 'CLEAR_LOADING';


export class postSlider implements Action {
    readonly type = POST_SLIDER;

    constructor(public payload : Slider ){}
}

export class saveSlider implements Action {
    readonly type = SAVE_SLIDER;

    constructor(public payload : Slider ){}
}

export class fetchSliders implements Action {
    readonly type = FETCH_SLIDERS;

    constructor(){}
}

export class loadSliders implements Action {
    readonly type = LOAD_SLIDERS

    constructor(public payload : Slider[] ){}
}

export class deleteSlider implements Action {
    readonly type = DELETE_SLIDER

    constructor(public payload :{ id : string  , withImages : boolean}){}
}

export class clearLoading implements Action {
    readonly type = CLEAR_LOADING

    constructor(){}
}




export type slidersActions = postSlider| fetchSliders | saveSlider | loadSliders | deleteSlider | clearLoading  ;