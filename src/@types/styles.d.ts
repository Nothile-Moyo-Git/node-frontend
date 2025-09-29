/**
 * Date created: 25/09/2025
 * Author: Nothile Moyo
 *
 * Styling definitions for typescript issues
 */

declare module "*.scss";
declare module "*.sass";

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
declare module "*.module.sass" {
  const classes: { [key: string]: string };
  export default classes;
}
