/**
 *
 * Date created: 27/01/2026
 *
 * Author: Nothile Moyo
 *
 * Description: A helper file for Dealing with post validation
 */

type FormFieldItem = {
  name: string;
  value: string;
};
type FormFieldItems = {
  fields: FormFieldItem[];
};

interface ValidateFieldsProps {
  form: FormFieldItems;
  isDevelopment: boolean;
}

const validateFields = ({ form, isDevelopment }: ValidateFieldsProps) => {
  const title = form.fields.filter((field) => field.name === "title");
  const content = form.fields.filter((field) => field.name === "content");
  const image = form.fields.filter((field) => field.name === "image");

  let titleValid,
    contentValid = true;

  if (title.length < 3 || title.length > 100) {
    titleValid = false;
  }

  if (content.length < 6 || content.length > 600) {
    contentValid = false;
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
