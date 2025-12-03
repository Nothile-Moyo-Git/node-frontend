/**
 * Date created: 25/09/2025
 * Author: Nothile Moyo
 *
 * Styling definitions for typescript issues
 */

// Allow imports of these types of files
declare module "*.css";
declare module "*.scss";
declare module "*.sass";

// Same with these, but these are for modules
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
declare module "*.module.sass" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
