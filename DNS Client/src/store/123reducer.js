import * as actionTypes from './types';
import axios from 'axios';

const initialState = {
    auth:{

        isAuthenticated:false,
    },
    tasks:{
        'task-1':{id:'task-1',content:"This is my first task",status:"TO-DO"},
        'task-2':{id:'task-2',content:"This is my second task",status:"TO-DO"},
        'task-3':{id:'task-3',content:"This is my third task",status:"TO-DO"},
        'task-4':{id:'task-4',content:"This is my fourth task",status:"TO-DO"},
        'task-5':{id:'task-5',content:"This is my fifth task",status:"TO-DO"}
    },
    coloumns:{
        'coloumn-1':{
            id:'coloumn-1',
            title:"To-Do",
            status:"To-DO",
            taskIds:["task-1","task-2","task-3","task-4","task-5"]

        },
        'coloumn-2':{
            id:'coloumn-2',
            title:"In-Progress",
            status:"In-Progress",
            taskIds:[]

        },
        'coloumn-3':{
            id:'coloumn-3',
            title:"Completed",
            status:"Completed",
            taskIds:[]

        }
    },
    coloumnOrder:['coloumn-1','coloumn-2','coloumn-3']
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_TASK: {
            return {
                ...action.newState,
               
            }
        }

        case actionTypes.MOVE_TASK: {
            return {
                ...action.newState,
            }
        }
        case actionTypes.LOGIN_SUCCESS:{
            
            return{
                ...state,authenticated:true
            }
        }
        case actionTypes.REGISTER_SUCCESS:{
          
        }
        // case actionTypes
        default:
            return state;



    }
};

export default reducer;