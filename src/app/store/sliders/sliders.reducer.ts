import * as slidersAction  from './sliders.actions';
import { Slider } from 'src/app/models/slider';




export interface State {
    availableSliders: Slider[],
    isLoading : boolean

}

const intialState : State = {
    availableSliders: [],
    isLoading : false

};


export function slidersReducer (state = intialState , action : slidersAction.slidersActions){

    switch(action.type){

        case slidersAction.POST_SLIDER:
            return {...state  , isLoading : true };

        case slidersAction.SAVE_SLIDER:
        {
            let sliders = [...state.availableSliders];

            const index = sliders.findIndex(item => item.id === action.payload.id);
            if(index > -1) {
                sliders[index] = action.payload;
            } else {
                sliders = [...sliders , action.payload];
            }

            return {...state , availableSliders : [...sliders ] , isLoading : false}
        }
        case slidersAction.FETCH_SLIDERS: 
             return {...state , isLoading : true}

        case slidersAction.LOAD_SLIDERS: 
             return {...state , availableSliders: action.payload  , isLoading : false}

        case slidersAction.DELETE_SLIDER:
            const sliders = state.availableSliders.filter(slider => slider.id !== action.payload.id)
            return {...state , availableSliders : sliders , isLoading : true }

        case slidersAction.CLEAR_LOADING:
            return {...state ,  isLoading : false}
        default:
            return state;
    }
}

