// User roles
export const UserRoles = ['hr', 'viewer'];

// Holiday types
export const HolidayKinds = ['paid', 'unpaid', 'sick'];

// Employee status
export const EmployeeStatuses = ['active', 'resigned'];

// Supported currencies
export const Currencies = ['USD', 'EUR', 'PKR'];

/**
 * @typedef {Object} Money
 * @property {number} amount
 * @property {string} currency
 */

/**
 * @typedef {Object} Raise
 * @property {string} date
 * @property {number} amount
 * @property {string} currency
 */

/**
 * @typedef {Object} Holiday
 * @property {string} id
 * @property {string} date
 * @property {'paid' | 'unpaid' | 'sick'} kind
 */

/**
 * @typedef {Object} Employee
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string} dept
 * @property {string} title
 * @property {'active' | 'resigned'} status
 * @property {Money} hourlyRate
 * @property {string} hireDate
 * @property {Raise[]} raises
 * @property {Holiday[]} holidays
 * @property {string} createdAt
 */

/**
 * @typedef {Object} DeptSummary
 * @property {string} dept
 * @property {number} headCount
 * @property {number} billableHours
 * @property {number} monthlyCost
 */

/**
 * @typedef {Object} PayrollSummary
 * @property {DeptSummary[]} byDept
 * @property {number} totalHeadCount
 * @property {number} totalBillableHours
 * @property {number} totalMonthlyCost
 */
