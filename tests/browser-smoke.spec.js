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

  const pageErrors = [];
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


test('camera preview remains usable and explains a blocked AI model download', async ({ page, context }) => {
  await context.grantPermissions(['camera']);
  await page.route('https://storage.googleapis.com/mediapipe-models/**', route => route.abort());

  await page.goto('/');
  await page.getByRole('button', { name: 'Aktifkan kamera' }).click();

  await expect(page.getByText(/Model AI rambut gagal dimuat/i)).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('video.camera-video')).toHaveClass(/is-on/);
});


test('PWA metadata is present and installation guidance works', async ({ page }) => {
  await page.goto('/');
  const manifest = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(manifest).toBe('/manifest.webmanifest');
  const response = await page.request.get('/manifest.webmanifest');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.name).toContain('RUPAAI');
  expect(data.display).toBe('standalone');
  await page.getByRole('button', { name: 'Pasang aplikasi RUPAAI' }).click();
  await expect(page.getByRole('dialog', { name: /Pasang untuk akses lebih cepat/i })).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('Add to Home Screen');
});

test('layout remains usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Rambut baru/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pasang aplikasi RUPAAI' })).toBeVisible();
  await expect(page.locator('.studio-grid')).toBeVisible();
});


test('haircut and color controls update the selected reference without claiming a cut is applied', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Hair colors' }).click();
  await page.getByRole('button', { name: 'Pilih warna Copper' }).click();
  await expect(page.locator('.selection-summary')).toContainText('Copper');
  await page.getByRole('tab', { name: 'Haircuts' }).click();
  await page.getByRole('button', { name: /Modern Pixie/i }).click();
  await expect(page.locator('.selection-summary')).toContainText('Modern Pixie');
  await expect(page.locator('.panel-footnote')).toContainText('belum mengubah bentuk rambut');
});
