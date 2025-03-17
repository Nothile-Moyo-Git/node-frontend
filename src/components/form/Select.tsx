/**
 * Date created: 29/04/2024
 *
 * Author: Nothile Moyo
 *
 * Select component, incoorperates the styling that is required for a select component
 * This will have variants, one that is currently used for pagination and another that is used for form inputs
 *
 * @param pages ?: number[] -> An array of numbers starting from 1 which are iterated through for options
 */

import React, { useState, useEffect, forwardRef } from "react";
import "./Select.scss";
interface ComponentProps {
  id: string;
  currentValue: number | string;
  labelledBy?: string;
  name: string;
  pages?: number[] | undefined;
  variant: string;
  options?: string[];
  ref: React.RefObject<HTMLSelectElement>;
  required?: boolean;
}

/**
 * @component Select
 * @description The Select component, used to render drop-downs of different types
 *
 * @param id : string
 * @param currentValue ?: number | string
 * @param labelledBy ?: string
 * @param name : string
 * @param pages ?: number[] | undefined
 * @param variant : string
 * @param options ?: string[]
 * @param ref : React.RefObject<HTMLSelectElement>
 * @param required ?: boolean
 */
export const Select = forwardRef<HTMLSelectElement, ComponentProps>(
  function SelectComponent(props, ref) {
    const [classNames, setClassNames] = useState<string>("");
    const [value, setValue] = useState<number | string>(props.currentValue);

    // Set the classnames for styling when the component renders
    useEffect(() => {
      switch (props.variant) {
        case "pagination":
          setClassNames("select select--pagination");
          break;

        default:
          setClassNames("select");
          break;
      }
    }, [props.variant]);

    // Update the value on change so that we can reference the new value in our ref
    const updateValue = (event: React.FormEvent<HTMLSelectElement>) => {
      // You have to use currentTarget.value here even though you won't see them
      // Note: currentTarget returns null on console checks but exists
      setValue(event.currentTarget.value);
    };

    // Update the page in the Select component if the page updates in props
    // Note: We use props.currentValue instead of value since we don't want to trigger infinite loops
    useEffect(() => {
      setValue(props.currentValue);
    }, [props.currentValue]);

    return (
      <select
        aria-labelledby={props?.labelledBy}
        className={classNames}
        id={props.id}
        name={props.name}
        onChange={updateValue}
        ref={ref}
        required={props.required}
        value={value}
      >
        {props.pages &&
          props.pages.length > 0 &&
          props.options === undefined &&
          props.pages.map((page: number) => (
            <option className="option" value={page} key={`page-${page}`}>
              {page}
            </option>
          ))}
      </select>
    );
  },
);
