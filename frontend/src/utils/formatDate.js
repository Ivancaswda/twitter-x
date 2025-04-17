export const formatDate = (createdAt) => {
    const currentDate = new Date();
    const createdAtDate = new Date(createdAt);

    const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000);
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
    const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
    const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

    if (timeDifferenceInDays > 1) {
        return createdAtDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else if (timeDifferenceInDays === 1) {
        return "1д назад";
    } else if (timeDifferenceInHours >= 1) {
        return `${timeDifferenceInHours}ч назад`;
    } else if (timeDifferenceInMinutes >= 1) {
        return `${timeDifferenceInMinutes}м назад`;
    } else {
        return "Только что";
    }
};

export const formattedMemberSince = (createdAt) => {
    const date = new Date(createdAt)
    const months = [
        'Январь',
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь"
    ]

    const month = months[date.getMonth()]

    const year = date.getFullYear()

    return `Присоеденился ${month}, ${year}`

}