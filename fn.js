export const validatePassword = (
  password,
  setWarningText,
  setIsPasswordValid,
) => {
  if (password === '') {
    setWarningText('');
    setIsPasswordValid(false);
    return;
  }
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    setWarningText('Password does not meet the requirements.');
    setIsPasswordValid(false);
  } else {
    setWarningText('');
    setIsPasswordValid(true);
  }
};
