import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/';

export const getLessons = async () => {
    return await axios.get(`${baseUrl}api/lessons`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
            return error;
        });
};

export const getLesson = async (id) => {
    return await axios.get(`${baseUrl}api/lessons/${id}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
            return error;
        });
};

export const postLesson = async (title, sub) => {
	return await axios.post(`${baseUrl}api/lessons/`, {
		title: title,
		subtitle: sub,
		coverImage: null,
	})
		.then(response => {
			return response.data;
		})
		.catch(error => {
			console.error(error);
			return error;
		});
};

export const postContent = async (lessonId, index, content, url) => {
	console.log('postContent', content)
	console.log('postURL', url)
	return await axios.post(`${baseUrl}api/lessons/${lessonId}/pages/`, {
		contents: content,
		url: url,
		files: null,
	})
		.then(response => {
			return response.data;
		})
		.catch(error => {
			console.error(error.response.data);
			return error;
		});
};