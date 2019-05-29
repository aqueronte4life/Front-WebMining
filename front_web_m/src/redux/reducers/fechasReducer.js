const initialState={
  fechaInicio: 0,
  fechaFinal: 0
}


export default (state = initialState, action) => {
  switch(action.type){
    case 'setFechas':
      return {
        ...state,
        fechaInicio: action.payload.fechaInicio,
        fechaFinal: action.payload.fechaFinal

      }
    default:
      return state;
  }
}
