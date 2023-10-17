import Axios from "../Config/axiosConfig";

const PostService = {
    getAllPostsByUserId: async (userId) => {
        return await Axios.get(`/apiPost/post/user/${userId}`);
    },
    createPost: async (post) => {
        return await Axios.post('/apiPost/createPost', post);
    }
}

export default PostService;