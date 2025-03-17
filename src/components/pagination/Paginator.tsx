/**
 * Date created : 26/04/2024
 *
 * Author : Nothile Moyo
 *
 * Paginator component
 * Manages pagination (typically) for a list on a page
 */

import { Link } from "react-router-dom";
import "./Paginator.scss";
import React, { FC, useState, useEffect, FormEvent, useRef } from "react";
import { BASENAME } from "../../util/util";
import { Select } from "../form/Select";
interface ComponentProps {
  numberOfPages: number;
  currentPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const Paginator: FC<ComponentProps> = ({
  numberOfPages,
  currentPage = 1,
  setPage,
}) => {
  const [previousPages, setPreviousPages] = useState<number[]>([]);
  const [upcomingPages, setUpcomingPages] = useState<number[]>([]);

  const pageRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    // Calculate the previous pages based on whether they can exist, this goes up to 2
    const tempPrevPages = [];

    if (currentPage - 1 >= 1) {
      tempPrevPages.unshift(currentPage - 1);
    }

    if (currentPage - 2 >= 1) {
      tempPrevPages.unshift(currentPage - 2);
    }

    setPreviousPages(tempPrevPages);

    // Calculate the upcoming pages based on whether they can exist. This also goes up to 2.
    const tempUpcomingPages = [];

    if (currentPage + 1 <= numberOfPages) {
      tempUpcomingPages.push(currentPage + 1);
    }

    if (currentPage + 2 <= numberOfPages) {
      tempUpcomingPages.push(currentPage + 2);
    }

    setUpcomingPages(tempUpcomingPages);
  }, [currentPage, numberOfPages]);

  // Update the page if we click on a number
  const updatePage = (page: number) => {
    setPage(page);
  };

  // Create an array of pages that we can pass to the select component
  const pagesArray: number[] = [];
  for (let i = 1; i <= numberOfPages; i++) {
    pagesArray.push(i);
  }

  // Handle the logic if we pick a page from the drop down
  const customPageSelected = async (event: FormEvent) => {
    event.preventDefault();

    // Update the page prop and trigger a re-render of the parent element
    if (pageRef.current) {
      setPage(Number(pageRef.current.value));
    }
  };

  return (
    <div className="paginator">
      {
        // Note: Hidden on mobile due to space contraints
        previousPages[0] > 1 && (
          <div className="paginator__min-max-wrapper">
            <Link
              to={`${BASENAME}/posts/1`}
              className="paginator__button"
              onClick={() => {
                updatePage(1);
              }}
            >
              1
            </Link>
            <p className="paginator__min-max-text">...</p>
          </div>
        )
      }

      {previousPages.length > 0 &&
        previousPages.map((pageNumber: number) => (
          <Link
            to={`${BASENAME}/posts/${pageNumber}`}
            className="paginator__button"
            onClick={() => {
              updatePage(pageNumber);
            }}
            key={`prev-page-${pageNumber}`}
          >
            {pageNumber}
          </Link>
        ))}

      {numberOfPages > 7 ? (
        <form
          className="paginator__select-wrapper"
          onSubmit={customPageSelected}
        >
          <Select
            currentValue={currentPage}
            id="pagination-select-component"
            name="pagination-dropdown"
            ref={pageRef}
            pages={pagesArray}
            variant="pagination"
          />
          <button className="paginator__button paginator__button--current-select">
            Go
          </button>
        </form>
      ) : (
        <button
          disabled
          className="paginator__button paginator__button--current-normal"
        >
          {currentPage}
        </button>
      )}

      {upcomingPages.length > 0 &&
        upcomingPages.map((pageNumber: number) => (
          <Link
            to={`${BASENAME}/posts/${pageNumber}`}
            className="paginator__button"
            onClick={() => {
              updatePage(pageNumber);
            }}
            key={`upcoming-page-${pageNumber}`}
          >
            {pageNumber}
          </Link>
        ))}

      {
        // Note: Hidden on mobile due to space contraints
        upcomingPages[1] < numberOfPages && (
          <div className="paginator__min-max-wrapper">
            <p className="paginator__min-max-text">...</p>
            <Link
              to={`${BASENAME}/posts/${numberOfPages}`}
              className="paginator__button"
              onClick={() => {
                updatePage(numberOfPages);
              }}
            >
              {numberOfPages}
            </Link>
          </div>
        )
      }
    </div>
  );
};
