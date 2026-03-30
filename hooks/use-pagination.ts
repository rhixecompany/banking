/**
 * Description placeholder
 *
 * @typedef {UsePaginationProps}
 */
interface UsePaginationProps {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay: number;
}

/**
 * Description placeholder
 *
 * @typedef {UsePaginationReturn}
 */
interface UsePaginationReturn {
  pages: number[];
  showLeftEllipsis: boolean;
  showRightEllipsis: boolean;
}

/**
 * Description placeholder
 *
 * @export
 * @param {UsePaginationProps} param0
 * @param {number} param0.currentPage
 * @param {number} param0.totalPages
 * @param {number} param0.paginationItemsToDisplay
 * @returns {UsePaginationReturn}
 */
export function usePagination({
  currentPage,
  paginationItemsToDisplay,
  totalPages,
}: UsePaginationProps): UsePaginationReturn {
  function calculatePaginationRange(): number[] {
    if (totalPages <= paginationItemsToDisplay) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfDisplay = Math.floor(paginationItemsToDisplay / 2);

    const initialRange = {
      end: currentPage + halfDisplay,
      start: currentPage - halfDisplay,
    };

    const adjustedRange = {
      end: Math.min(totalPages, initialRange.end),
      start: Math.max(1, initialRange.start),
    };

    if (adjustedRange.start === 1) {
      adjustedRange.end = Math.min(paginationItemsToDisplay, totalPages);
    }

    if (adjustedRange.end === totalPages) {
      adjustedRange.start = Math.max(
        1,
        totalPages - paginationItemsToDisplay + 1,
      );
    }

    return Array.from(
      { length: adjustedRange.end - adjustedRange.start + 1 },
      (_, i) => adjustedRange.start + i,
    );
  }

  const pages = calculatePaginationRange();
  const lastPage = pages.at(-1);

  // Determine ellipsis display based on the actual pages shown
  const showLeftEllipsis = pages.length > 0 && pages[0] > 1 && pages[0] > 2;

  const showRightEllipsis =
    pages.length > 0 &&
    lastPage !== undefined &&
    lastPage < totalPages &&
    lastPage < totalPages - 1;

  return {
    pages,
    showLeftEllipsis,
    showRightEllipsis,
  };
}
