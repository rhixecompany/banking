/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @interface HealthChecks
 * @typedef {HealthChecks}
 */
export interface HealthChecks {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {boolean}
   */
  database: boolean;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?boolean}
   */
  redis?: boolean;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @returns {Promise<boolean>}
 */
export function checkDatabase(): Promise<boolean>;
/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @returns {Promise<boolean | undefined>}
 */
export function checkRedis(): Promise<boolean | undefined>;
