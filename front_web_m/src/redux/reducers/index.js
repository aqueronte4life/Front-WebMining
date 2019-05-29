import {combineReducers} from 'redux';
import empresaReducer from './empresaReducer';
import fechasReducer from './fechasReducer'

export default combineReducers({
nombreEmpresa: empresaReducer,
fechas: fechasReducer
})
