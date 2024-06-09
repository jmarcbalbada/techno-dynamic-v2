import { useState, useEffect } from "react";
import { UsersService } from "../apis/UsersService";

const useUser = (user) => {
    const [opt_in, setOptIn] = useState(user.opt_in);
    const [u_user, setU_user] = useState([]);

    useEffect(() => {
        if (user.role === "teacher") {
            getOptInById();
        }
    }, [opt_in]);

    useEffect(() => {
        getUserViaId();
    }, []);

    const getOptInById = async () => {
        try {
            const response = await UsersService.getOptIn(user.id);
            setOptIn(response.data.opt_in);
        } catch (error) {
            console.log("error", error);
        }
    };

    const getUserViaId = async () => {
        try {
            const response = await UsersService.getUserbyID(user.id);
            setU_user(response.data);
        } catch (error) {
            console.log("error", error);
        }
    };

    return { opt_in, u_user };
};

export default useUser;
