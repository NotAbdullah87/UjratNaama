const { calculatePayrollSummary } = require('../src/services/payrollService');
const Employee = require('../src/models/Employee');
const { getBusinessDaysInMonth } = require('../src/utils/dateUtils');

jest.mock('../src/models/Employee');

describe('Payroll Calculator', () => {
  test('should calculate billable hours correctly', () => {
    const businessDays = getBusinessDaysInMonth(2025, 6);
    expect(businessDays).toBeGreaterThan(0);
    expect(businessDays).toBeLessThanOrEqual(23); // Max possible business days
  });

  test('should calculate monthly cost correctly', async () => {
    const mockEmployees = [
      {
        name: 'Employee 1',
        dept: 'Engineering',
        status: 'active',
        hourlyRate: { amount: 50, currency: 'USD' },
        holidays: []
      },
      {
        name: 'Employee 2',
        dept: 'Engineering',
        status: 'active',
        hourlyRate: { amount: 60, currency: 'USD' },
        holidays: [
          { date: new Date('2025-06-15'), kind: 'unpaid' }
        ]
      }
    ];

    Employee.find.mockResolvedValue(mockEmployees);

    const summary = await calculatePayrollSummary('2025-06', 'USD');
    
    expect(summary.totalHeadCount).toBe(2);
    expect(summary.totalBillableHours).toBeGreaterThan(0);
    expect(summary.totalMonthlyCost).toBeGreaterThan(0);
    expect(summary.byDept).toHaveLength(1);
    expect(summary.byDept[0].dept).toBe('Engineering');
  });
});