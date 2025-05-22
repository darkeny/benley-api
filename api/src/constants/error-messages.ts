const failedRetrieval = "Failed to retrieve item";

const notFound = "No items found";

const requiredFields = "All fields are required";

const errorCreating = "Error creating item";

const duplicatedData = "Item with this identifier already exists";

const wrong = "Something went wrong.";

const requiredUpload = "Please upload a PDF file.";

const failedDeletion = "Error deleting item";

const invalidCredentials = "Invalid email or password.";

const errorLogin = "Erro ao efetuar login. Tente novamente mais tarde."

const duplicateEmail = 'O email já foi utilizado para inscrição.';

const duplicateIdentityNumber = 'O Bilhete de Identidade já foi utilizado para inscrição.';

const duplicateActiveLoan = 'Este cliente já possui um empréstimo ativo.';

const failedUpdate = "Error updating item";

const requiredCustomer = "Usuário não Associado!.";

const invalidToken = 'Token inválido ou ausente.';

const ThrowActiveLoan = "Cliente possui um empréstimo ativo e não pode ser excluído."



const ERROR_MESSAGES = {
    errorLogin,
    failedUpdate,
    duplicateEmail,
    requiredCustomer,
    ThrowActiveLoan,
    duplicateIdentityNumber,
    invalidToken,
    invalidCredentials,
    duplicatedData,
    failedRetrieval,
    requiredFields,
    errorCreating,
    notFound,
    wrong,
    requiredUpload,
    failedDeletion,
    duplicateActiveLoan
}

export default ERROR_MESSAGES;