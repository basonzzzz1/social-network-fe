import axios from "axios";
import { toast } from 'react-toastify';
import {
    ADD_COMMENT_API,
    API_ADD_FRIEND_REQUEST, API_ALL_FRIEND,
    API_ALL_FRIEND_REQUEST, API_ALL_FRIENDSHIP_SUGGESTIONS, API_DELETE_FRIEND_REQUEST,
    API_SEARCH_NAME,
    COMMENT_DELETE_API,
    COMMENT_UPDATE_API,
    FAVOURITE_ADD_API,
    FAVOURITE_ALL_API, FAVOURITE_DELETE_API,
    GET_ALL_COMMENT_API,
    GET_ALL_FRIEND,
    LIKE_API,
    LIKE_DELETE_API,
    LIST_MESSAGE_BY_FRIEND,
    LIST_MESSAGE_BY_TIME_ACCOUNT,
    LOGIN_API, LOGOUT_API,
    POST_API,
    POST_DELETE_API,
    POST_FOLLOW_API,
    POST_STATUS_API,
    POST_UPDATE_API,
    POST_USE_API,
    REGISTER_API,
    SEND_MESSAGE,
    USER_EDIT_PROFILE_API,
    USER_PROFILE_API
} from "../api/api";
const Service = {
    login: (account) => {
        return new Promise((resolve, reject) => {
            axios.post(LOGIN_API,account)
                .then(response => {
                    console.log(response)
                    toast.success("login success !");
                    localStorage.setItem("idAccount",response.data.id);
                    resolve(response.data);
                })
                .catch(function (err) {
                    toast.error(err);
                    reject(err)
                });
        });
    },
    logout: () => {
        return new Promise((resolve, reject) => {
            axios.get(LOGOUT_API+localStorage.getItem("idAccount"), {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    resolve(response);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    register: (formData) => {
        console.log(formData);
        return new Promise((resolve, reject) => {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: REGISTER_API,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data : formData
            };
            axios.request(config)
                .then(response => {
                    toast.success("Register Success !");
                    resolve(response.data);
                })
                .catch(function (err) {
                    toast.error(err)
                    reject(err)
                });
        });
    },

    createPost: (formData) => {
        console.log(formData);
        return new Promise((resolve, reject) => {
            let id = localStorage.getItem("idAccount");
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: POST_API+"/"+id,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data : formData
            };
            axios.request(config)
                .then(response => {
                    toast.success("Create Post Success !");
                    resolve(response.data);
                })
                .catch(function (err) {
                    toast.error(err)
                    reject(err)
                });
        });
    },
    updatePost: (post1) => {
        return new Promise((resolve, reject) => {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: POST_UPDATE_API,
                data: post1,
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            axios.request(config)
                .then(response => {
                    toast.success("Update Post Success !");
                    resolve(response.data);
                })
                .catch(function (err) {
                    toast.error(err)
                    reject(err)
                });
        });
    },
    sendMessage: (id,data) => {
        return new Promise((resolve, reject) => {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: SEND_MESSAGE+id,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            axios.request(config)
                .then(response => {
                    toast.success("Send Message Success !");
                    resolve(response.data);
                })
                .catch(function (err) {
                    toast.error(err)
                    reject(err)
                });
        });
    },
    getMessageByFriend: (id,account) => {
        return new Promise((resolve, reject) => {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: LIST_MESSAGE_BY_FRIEND+id,
                data: account,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                },
            };
            axios.request(config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(function (err) {
                    toast.error(err)
                    reject(err)
                });
        });
    },
    getAllStatus: async () => {
        return await axios.get(POST_STATUS_API);
    },

    profile: () => {
        return new Promise((resolve, reject) => {
            axios.get(USER_PROFILE_API+localStorage.getItem("idAccount"), {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {

                    resolve(response);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    seeProfile: (id) => {
        return new Promise((resolve, reject) => {
            axios.get(USER_PROFILE_API+id, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    resolve(response);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    postByUser: (id) => {
        return new Promise((resolve, reject) => {
            axios.get(POST_USE_API+id, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    editProfile: (formData,id) => {
        console.log(formData);
        return new Promise((resolve, reject) => {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: USER_EDIT_PROFILE_API+id,
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                },
                data : formData
            };
            axios.request(config)
                .then(response => {
                    toast.success("Edit Profile Success !");
                    resolve(response.data);
                })
                .catch(function (err) {
                    toast.error(err)
                    reject(err)
                });
        });
    },

    findAllPost: () => {
        return new Promise((resolve, reject) => {
            axios.get(POST_FOLLOW_API+localStorage.getItem("idAccount"),{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    findByPost: (id) => {
        return new Promise((resolve, reject) => {
            axios.get(POST_API+"/"+id,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    findByListMessageFriend: (id) => {
        return new Promise((resolve, reject) => {
            axios.get(LIST_MESSAGE_BY_TIME_ACCOUNT+localStorage.getItem("idAccount"),{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    findByAllFriendByAccount: (id) => {
        return new Promise((resolve, reject) => {
            axios.get(GET_ALL_FRIEND+id,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    deleteFavourite: (id) => {
        return new Promise((resolve, reject) => {
            axios.get(FAVOURITE_DELETE_API+id,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    toast.success("delete favourite success !")
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    deleteFriendRequest: (id) => {
        return new Promise((resolve, reject) => {
            axios.get(API_DELETE_FRIEND_REQUEST+id,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    toast.success("delete Friend Request success !")
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    getAllFriendshipSuggestions: () => {
        return new Promise((resolve, reject) => {
            axios.get(API_ALL_FRIENDSHIP_SUGGESTIONS+localStorage.getItem("idAccount"),{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    findFavourite: () => {
        return new Promise((resolve, reject) => {
            axios.get(FAVOURITE_ALL_API+localStorage.getItem("idAccount"),{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    allFriend: () => {
        return new Promise((resolve, reject) => {
            axios.get(API_ALL_FRIEND+localStorage.getItem("idAccount"),{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    addFavourite: (idFromUser , idToUser) => {
        return new Promise((resolve, reject) => {
            axios.get(FAVOURITE_ADD_API+idFromUser+"/"+idToUser,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    toast.success("Add Monitor success !")
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    searchName: (name) => {
        return new Promise((resolve, reject) => {
            axios.get(API_SEARCH_NAME+name,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    resolve(response);
                })
                .catch(function (err) {
                    toast.error(err);
                    reject(err);
                });
        });
    },
    addFriendRequest: (data) => {
        return new Promise((resolve, reject) => {
            axios.post(API_ADD_FRIEND_REQUEST,data,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    toast.success("sent friend request successfully !");
                    resolve(response);
                })
                .catch(function (err) {
                    toast.error(err);
                    reject(err);
                });
        });
    },

    allFriendRequest: () => {
        return new Promise((resolve, reject) => {
            axios.get(API_ALL_FRIEND_REQUEST+localStorage.getItem("idAccount"),{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    resolve(response);
                })
                .catch(function (err) {
                    toast.error(err);
                    reject(err);
                });
        });
    },
    deletePost: (id) => {
        return new Promise((resolve, reject) => {
            axios.post(POST_DELETE_API+id, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    toast.success("Delete Post Success !");
                    resolve(response.data);
                })
                .catch(function (err) {
                    toast.error(err)
                    reject(err)
                });
        });
    },
    likePost: (like) => {
        return new Promise((resolve, reject) => {
            axios.post(LIKE_API, like,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),

                }
            })
                .then(response => {
                    toast.success("Like Post Success !");
                    resolve(response.data);
                })
                .catch(function (err) {
                    toast.error(err)
                    reject(err)
                });
        });
    },
    findAllLike: () => {
        return new Promise((resolve, reject) => {
            axios.get(LIKE_API,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    deleteLike: (id) => {
        return new Promise((resolve, reject) => {
            let config = {
                method: 'post',
                url: LIKE_DELETE_API+id,
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                },
            };
            axios.request(config)
                .then(response => {
                    toast.success("Delete Like Success !");
                    resolve(response);
                })
                .catch(function (err) {
                    toast.error(err)
                    reject(err)
                });
        });
    },
    getAllComment: () => {
        return new Promise((resolve, reject) => {
            axios.get(GET_ALL_COMMENT_API,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },

    deleteComment: (id) => {
        return new Promise((resolve, reject) => {
            let config = {
                method: 'POST',
                url: COMMENT_DELETE_API+id,
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                },
            };
            axios.request(config)
                .then(response => {
                    resolve(response);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },


    // Thông qua axios.post, bạn đang thực hiện một POST request đến ADD_COMMENT_API và truyền dữ liệu bình luận thông qua biến comment.
    addComment: (comment) => {
        return new Promise((resolve, reject) => {
            axios.post(ADD_COMMENT_API,comment,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),

                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },

    updateComment: (comment) => {
        return new Promise((resolve, reject) => {
            axios.post(COMMENT_UPDATE_API,comment,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),

                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(function (err) {
                    reject(err)
                });
        });
    },
    isTheUserLoggedIn: () => {
        const token = localStorage.getItem('token')
        if (token != null && token != undefined) {
            return true;
        }
        return false;
    },

};
export default Service;
