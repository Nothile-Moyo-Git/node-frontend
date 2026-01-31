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

const validateFields = ({ fields }: FormFieldItems) => {
  const title = fields.find((field) => field.name === "title");
  const content = fields.find((field) => field.name === "content");

  console.log("Title");
  console.log(title);
  console.log("Content");
  console.log(content);
  console.log("\n\n");

  let titleValid = true;
  let contentValid = true;

  if (title && (title.value.length < 3 || title.value.length > 100)) {
    titleValid = false;
  }

  if (content && (content.value.length < 6 || content.value.length > 600)) {
    contentValid = false;
  }

  const isFormValid = titleValid && contentValid;

  return { isFormValid, titleValid, contentValid };
};

export default validateFields;
