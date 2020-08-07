export const create = (userId, token, post) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: post,
    })
        .then((response) => response.json())
        .catch((err) => console.log(err));
};

export const list = (page) => {
    return fetch(`${process.env.REACT_APP_API_URL}/posts/?page=${page}`, {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const singlePost = (postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .catch((err) => console.log(err));
};

export const listByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/posts/by/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .catch((err) => console.log(err));
};

export const remove = (postId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .catch((err) => console.log(err));
};

export const update = (postId, token, postData) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: postData,
    })
        .then((response) => response.json())
        .catch((err) => console.log(err));
};

export const like = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/like`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, userId }),
    })
        .then((response) => response.json())
        .catch((err) => console.log(err));
};

export const unlike = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/unlike`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, userId }),
    })
        .then((response) => response.json())
        .catch((err) => console.log(err));
};

export const comment = (userId, token, postId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, userId, comment }),
    })
        .then((response) => response.json())
        .catch((err) => console.log(err));
};

export const uncomment = (userId, token, postId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, userId, comment }),
    })
        .then((response) => response.json())
        .catch((err) => console.log(err));
};
