const generatePassword = (): string => {
    const length = 8;
    const charset = "ab!@#$%c5678defghijklrstuvABCDEFGHI|}{[]:JKLMNOPQRSTUVWXYZ012mnopq3456789&*()_+~`;?,./-wxyz=";
    let password = "";

    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }

    return password;
};

const calculateAge = (dateOfBirth: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();

    if (
        today.getMonth() < dateOfBirth.getMonth() ||
        (today.getMonth() === dateOfBirth.getMonth() && today.getDate() < dateOfBirth.getDate())
    ) {
        age--;
    }

    return age;
}


const formatDateForToday = (city = "Maputo") => {
    const today = new Date();

    const months = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];

    return `${city}, aos ${today.getDate()} de ${months[today.getMonth()]} de ${today.getFullYear()}`;
}


const calculateDaysLeft = (createdAt: string, totalDays: number) => {
    const currentDate = new Date();
    const loanCreatedAt = new Date(createdAt);

    // Calcula a data de vencimento do empréstimo
    const endDate = new Date(loanCreatedAt);
    endDate.setDate(endDate.getDate() + totalDays);

    // Calcula a diferença em milissegundos e converte para dias
    const differenceInTime = endDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays >= 0 ? differenceInDays : 0;  // Retorna 0 se o prazo já tiver passado
};

const calcEndDate = (loanCreatedAt) => {
    const endDate = new Date(loanCreatedAt.setDate(loanCreatedAt.getDate() + 31));

    return new Date(endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}




export { generatePassword, calculateAge, formatDateForToday, calculateDaysLeft, calcEndDate };



