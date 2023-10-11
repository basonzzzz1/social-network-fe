import axios from "axios";
import { toast } from 'react-toastify';
import {
    LIKE_API,
    LIKE_DELETE_API,
    LOGIN_API,
    POST_API, POST_DELETE_API, POST_FOLLOW_API, POST_STATUS_API,
    REGISTER_API,
    USER_EDIT_PROFILE_API,
    USER_PROFILE_API
} from "../api/api";
import ToastComponent from "../common/ToastComponent";
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';
// const socket = new SockJS('http://localhost:8080/ws');
// const stompClient = Stomp.over(socket);
// stompClient.connect({}, (frame) => {
//     console.log('Connected to WebSocket');
//
//     // Lắng nghe tin nhắn từ máy chủ
//     stompClient.subscribe('/topic/like', (message) => {
//         console.log('Received like message:', message.body);
//         // Xử lý tin nhắn like ở đây
//         // Ví dụ: cập nhật trạng thái like trong danh sách bài viết
//         // Cần có một cơ chế để xác định bài viết được like và người dùng thực hiện like
//     });
//
//     stompClient.subscribe('/topic/deleteLike', (message) => {
//         console.log('Received deleteLike message:', message.body);
//         // Xử lý tin nhắn deleteLike ở đây
//         // Ví dụ: cập nhật trạng thái deleteLike trong danh sách bài viết
//     });
// });
//
// // Sau khi thực hiện các hoạt động liên quan đến like, bạn có thể gửi tin nhắn WebSocket để thông báo về sự kiện like hoặc deleteLike.
// // Dưới đây là một ví dụ gửi tin nhắn like:
// const likePost = (postId) => {
//     stompClient.send('/app/like', {}, JSON.stringify({ postId }));
// };
//
// // Và gửi tin nhắn deleteLike:
// const deleteLike = (likeId) => {
//     stompClient.send('/app/deleteLike', {}, JSON.stringify({ likeId }));
// };
const Service = {
    login: (account) => {
        return new Promise((resolve, reject) => {
            axios.post(LOGIN_API,account)
                .then(response => {
                    console.log(response)
                    localStorage.setItem("idAccount",response.data.id);
                    resolve(response.data);
                })
                .catch(function (err) {
                    toast.error(<ToastComponent.errorToast text={'Unauthorized'} />, {
                        position: toast.POSITION.TOP_RIGHT
                    });
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
                    resolve(response.data);
                })
                .catch(function (err) {
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
                    resolve(response.data);
                })
                .catch(function (err) {
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
                    localStorage.setItem("account",response.data)
                    resolve(response);
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
                    resolve(response.data);
                })
                .catch(function (err) {
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
    findAllPostByFollow: () => {
        return new Promise((resolve, reject) => {
            axios.get(POST_FOLLOW_API+localStorage.getItem("idAccount"), {
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
    deletePost: (id) => {
        return new Promise((resolve, reject) => {
            axios.post(POST_DELETE_API+id, {
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
    likePost: (like) => {
        return new Promise((resolve, reject) => {
            axios.post(LIKE_API, like,{
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
                    resolve(response);
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
