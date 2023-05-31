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

export const postLesson = async (sub) => {
	return await axios.post(`${baseUrl}api/lessons/`, {
		title: 'sample',
		subtitle: sub,
		url: null,
	})
		.then(response => {
			return response.data;
		})
		.catch(error => {
			console.error(error);
			return error;
		});
};

export const postContent = async (lessonId, index, content) => {
	return await axios.post(`${baseUrl}api/lessons/${lessonId}/contents/`, {
		contents: content,
		files: null,
	})
		.then(response => {
			return response.data;
		})
		.catch(error => {
			console.error(error);
			return error;
		});
};