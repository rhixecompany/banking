/**
 * Description placeholder
 * @author [object Object]
 *
 * @interface UsePaginationProps
 * @typedef {UsePaginationProps}
 */
interface UsePaginationProps {
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {number}
   */
  currentPage: number;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {number}
   */
  totalPages: number;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {number}
   */
  paginationItemsToDisplay: number;
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @interface UsePaginationReturn
 * @typedef {UsePaginationReturn}
 */
interface UsePaginationReturn {
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {number[]}
   */
  pages: number[];
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {boolean}
   */
  showLeftEllipsis: boolean;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {boolean}
   */
  showRightEllipsis: boolean;
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @param {UsePaginationProps} param0
 * @param {number} param0.currentPage
 * @param {number} param0.paginationItemsToDisplay
 * @param {number} param0.totalPages
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

  // Determine ellipsis display based on the actual pages shown
  const showLeftEllipsis = pages.length > 0 && pages[0] > 1 && pages[0] > 2;

  const showRightEllipsis =
    pages.length > 0 &&
    (pages.at(-1) ?? 0) < totalPages &&
    (pages.at(-1) ?? 0) < totalPages - 1;

  return {
    pages,
    showLeftEllipsis,
    showRightEllipsis,
  };
}
