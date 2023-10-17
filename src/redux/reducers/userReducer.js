const initialState = {
    userToken: JSON.parse(localStorage.getItem("userToken")) || {},
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_USER_TOKEN':
            let userToken = action.payload;
            return {
                ...state,
                userToken: {...state.userToken, ...userToken},
            };
        default:
            return state;
    }
};

export default userReducer;