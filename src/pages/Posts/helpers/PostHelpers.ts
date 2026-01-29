/**
 *
 * Date created: 27/01/2026
 *
 * Author: Nothile Moyo
 *
 * Description: A helper file for Dealing with post validation
 */

export type FormFieldItem = {
  name: string;
  value: string;
};

export type FormFieldItems = {
  fields: FormFieldItem[];
};

export interface FormFields {
  form: FormFieldItems;
}

const validateFields = ({ form }: FormFields) => {
  const fields = form.fields;

  const title = fields.find((field) => field.name === "title");
  const content = fields.find((field) => field.name === "content");

  let titleValid,
    contentValid = true;

  if (title && (title.value.length < 3 || title.value.length > 100)) {
    titleValid = false;
  }

  if (content && (content.value.length < 6 || content.value.length > 600)) {
    contentValid = false;
  }

  const formValid = titleValid && contentValid;

  return { isFormValid: formValid, titleValid, contentValid };
};

export default validateFields;
