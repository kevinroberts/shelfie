import {
  ADD_UPLOADED_CLIP,
  RESET_UPLOADED,
} from '../actions/types';

const INITIAL_STATE = {
  uploadedClips: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_UPLOADED_CLIP:
      return { ...state, uploadedClips: [...state.uploadedClips, action.payload] };
    case RESET_UPLOADED:
      return { ...state, uploadedClips: [] };
    default:
      return state;
  }
};
