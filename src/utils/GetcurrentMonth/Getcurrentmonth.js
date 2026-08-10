export default function getCurrentMonth() {

    const date = new Date();

    return date.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

}