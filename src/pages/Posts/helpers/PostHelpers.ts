/**
 *
 * Date created: 27/01/2026
 *
 * Author: Nothile Moyo
 *
 * Description: A helper file for Dealing with post validation
 */

interface InputValuesProps {
  title: string;
  content: string;
}

type InputValidity {
  formValid: 
};

const validateFields: InputValuesProps = ({ title, content }) => {
  let inputsValid = true;

  if (title.length < 3 || title.length > 100) {
    setIsFormValid(false);
    setIsTitleValid(false);
    inputsValid = false;
  } else {
    setIsTitleValid(true);
  }

  if (content.length < 6 || content.length > 600) {
    setIsFormValid(false);
    setIsContentValid(false);
    inputsValid = false;
  } else {
    setIsContentValid(true);
  }

  if (isDevelopment) {
    if (!uploadFile) {
      setIsFormValid(false);
      setIsFileValid(false);
      inputsValid = false;
    }
  }

  return inputsValid;
};
