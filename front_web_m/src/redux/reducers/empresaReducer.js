const initialState={
  nombreEmpresa: ''
}


export default (state = initialState, action) => {
  switch(action.type){
    case 'setNombre':
      return {
        ...state,
        nombreEmpresa: action.payload,

      }
    default:
      return state;
  }
}
