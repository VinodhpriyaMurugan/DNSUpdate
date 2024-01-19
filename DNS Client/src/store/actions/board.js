import axios from 'axios';
// import { setAlert } from './alert';
import {
    ADD_TASK, MOVE_TASK, GET_BOARD
} from './../types';
import setAuthToken from './../../utils/setAuthToken';

const baseUrl = process.env.REACT_APP_API_URL;

export const getBoard = (boardId) => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    try {
        const res = await axios.get(baseUrl + '/api/board/' + boardId, config);
        console.log("Data from server====>", res.data)
        dispatch({
            type: GET_BOARD, payload: res.data
        })
    } catch (error) {
        console.log("Error===>", error)
        dispatch({
        });
    }

}

export const addTask = (taskData) => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    try {
        console.log("New task data====>", taskData)
        const res = await axios.post(baseUrl + '/api/board/addTask', { ...taskData }, config);
        dispatch({
            type: ADD_TASK
        })
        dispatch(getBoard(taskData.boardId))
    } catch (error) {
        console.log("Error===>", error)
        dispatch({
        });
    }


}
export const moveTask = (coloumns, draggerdTask, boardId, taskId) => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        console.log(coloumns, draggerdTask, boardId, taskId)
        const res = await axios.post(baseUrl + '/api/board/moveTask', { coloumns: coloumns, task: draggerdTask, boardId, taskId }, config);
        console.log(res.data);
        dispatch({
            type: MOVE_TASK, payload: {}
        })
        dispatch(getBoard(boardId))
    } catch (error) {
        console.log("Error===>", error)
        dispatch({
        });
    }


}

