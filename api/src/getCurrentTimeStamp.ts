export const timeStamp = () => {
    const date = new Date();
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const hour = date.getHours().toString();
    const minute = date.getMinutes().toString();
    return `${day}.${month}-${hour}:${minute}`
}