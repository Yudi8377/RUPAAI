import { test, expect } from '@playwright/test';

test('landing page renders and camera access starts only after user action', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, '__rupaaiCameraCalls', { value: 0, writable: true });
    const mediaDevices = navigator.mediaDevices;
    if (mediaDevices) {
      Object.defineProperty(mediaDevices, 'getUserMedia', {
        configurable: true,
        value: () => {
          navigator.__rupaaiCameraCalls += 1;
          return Promise.reject(new DOMException('Permission denied by browser test', 'NotAllowedError'));
        },
      });
    }
  });

  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Rambut baru/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Aktifkan kamera' })).toBeVisible();
  expect(await page.evaluate(() => navigator.__rupaaiCameraCalls)).toBe(0);

  await page.getByRole('button', { name: 'Aktifkan kamera' }).click();
  await expect(page.getByRole('alert')).toContainText('Kamera belum dapat diakses');
  expect(await page.evaluate(() => navigator.__rupaaiCameraCalls)).toBe(1);
  expect(pageErrors).toEqual([]);
});

test('hair color controls are available without starting the camera', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Temukan/i })).toBeVisible();
  await expect(page.getByText('Privasi diutamakan')).toBeVisible();
  expect(await page.evaluate(() => Boolean(navigator.mediaDevices?.getUserMedia))).toBe(true);
});
