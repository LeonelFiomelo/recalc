import { test, expect } from '@playwright/test';
import { seed } from '../src/seed.js';
import { Operation, History } from '../src/models.js'

test.describe('test', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async () => {
    await seed();
  })

  test('Deberia tener como titulo de pagina recalc', async ({ page }) => {
    await page.goto('./');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/recalc/i);
  });

  test('Deberia poder realizar una resta', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '7' }).click()
    await page.getByRole('button', { name: '9' }).click()
    await page.getByRole('button', { name: '-' }).click()
    await page.getByRole('button', { name: '9' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/sub/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(70);

    await expect(page.getByTestId('display')).toHaveValue(/70/)

    const operation = await Operation.findOne({
      where: {
        name: "SUB"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(79)
    expect(historyEntry.secondArg).toEqual(9)
    expect(historyEntry.result).toEqual(70)
  });

  test('Deberia poder realizar una suma', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '4' }).click()
    await page.getByRole('button', { name: '8' }).click()
    await page.getByRole('button', { name: '+' }).click()
    await page.getByRole('button', { name: '2' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/add/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(50);

    await expect(page.getByTestId('display')).toHaveValue(/50/)

    const operation = await Operation.findOne({
      where: {
        name: "ADD"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(48)
    expect(historyEntry.secondArg).toEqual(2)
    expect(historyEntry.result).toEqual(50)
  });

  test('Deberia poder realizar una mutiplicacion', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '2' }).click()
    await page.getByRole('button', { name: '*' }).click()
    await page.getByRole('button', { name: '3' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/multiply/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(6);

    await expect(page.getByTestId('display')).toHaveValue(/6/)

    const operation = await Operation.findOne({
      where: {
        name: "MUL"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(2)
    expect(historyEntry.secondArg).toEqual(3)
    expect(historyEntry.result).toEqual(6)
  });
})