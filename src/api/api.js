const API_BASE_URL = "https://api.example.com";

export const LOGIN_API = `http://localhost:8080/login`;
export const LOGOUT_API = `http://localhost:8080/logout/`;
export const REGISTER_API = `http://localhost:8080/register`;
export const USER_PROFILE_API = `http://localhost:8080/apiAccount/account/`;
export const USER_EDIT_PROFILE_API = `http://localhost:8080/apiAccount/account/edit/`;
export const POST_STATUS_API = `http://localhost:8080/apiPost/apiStatus`;
export const POST_API = `http://localhost:8080/apiPost`;
export const POST_UPDATE_API = `http://localhost:8080/apiPost/updatePost`;
// method post
export const POST_DELETE_API = `http://localhost:8080/apiPost/delete/`;
export const LIKE_API = `http://localhost:8080/apiLike`;
// method post
export const LIKE_DELETE_API = `http://localhost:8080/apiLike/`;
export const POST_FOLLOW_API = `http://localhost:8080/apiPost/getPostFollow/`;
export const POST_USE_API = `http://localhost:8080/apiPost/getAllByAccount/`;
export const LIST_MESSAGE_BY_TIME_ACCOUNT = `http://localhost:8080/message/allFriend/`;
export const LIST_MESSAGE_BY_FRIEND = `http://localhost:8080/message/all/`;
export const SEND_MESSAGE = `http://localhost:8080/message/chat/`;
export const API_SEARCH_NAME = `http://localhost:8080/apiAccount/search/`;
export const API_ADD_FRIEND_REQUEST = `http://localhost:8080/apiFollow/addFriendRequest`;
export const API_ALL_FRIEND_REQUEST = `http://localhost:8080/apiFollow/getFriendRequest/`;
export const API_ALL_FRIEND = `http://localhost:8080/apiFollow/allFollow/`;
export const API_ALL_FRIENDSHIP_SUGGESTIONS = `http://localhost:8080/apiFollow/getAllFriendshipSuggestions/`;
export const API_DELETE_FRIEND_REQUEST = `http://localhost:8080/apiFollow/deleteFriendRequest/`;
export const ADD_COMMENT_API = `http://localhost:8080/apiComment`;
export const GET_ALL_COMMENT_API = `http://localhost:8080/apiComment`;
export const COMMENT_DELETE_API =  `http://localhost:8080/apiComment/delete/`;
export const COMMENT_UPDATE_API = `http://localhost:8080/apiComment/update`;
export const GET_ALL_FRIEND = `http://localhost:8080/apiFollow/allFollow/`;
// get truyền hêm id của fromuser và touser
export const FAVOURITE_ADD_API = `http://localhost:8080/apiFavourite/add/`;
export const FAVOURITE_ALL_API = `http://localhost:8080/apiFavourite/all/`;
export const FAVOURITE_DELETE_API = `http://localhost:8080/apiFavourite/delete/`;
// Thêm các đường dẫn API khác ở đây