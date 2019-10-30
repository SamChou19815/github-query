import { createStore } from 'redux';

export type State = { readonly repositoryName: string | null };

const initialState: State = { repositoryName: null };

export type Action =
  | { readonly type: 'UPDATE_REPOSITORY_NAME'; readonly repositoryName: string }
  | { readonly type: 'RESET_REPOSITORY_NAME' };

const rootReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'UPDATE_REPOSITORY_NAME':
      return { ...state, repositoryName: action.repositoryName };
    case 'RESET_REPOSITORY_NAME':
      return { ...state, repositoryName: null };
    default:
      return state;
  }
};

export default createStore(rootReducer);
