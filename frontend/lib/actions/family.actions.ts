"use server";

export const getFamily = async () => {
    const res = await fetch("https://randomuser.me/api/?results=7&inc=name,email,picture&noinfo");
    const data = await res.json();
    return data.results;
}

export const getUser = async () => {
    const res = await fetch("https://randomuser.me/api/?results=1&inc=name,email,picture&noinfo");
    const data = await res.json();
    return data.results[0];
}