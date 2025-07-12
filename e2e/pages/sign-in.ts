import type { Page } from "@playwright/test";

enum TestId {
  EMAIL_INPUT = "email-input",
  EMAIL_ERROR = "email-error",
  PASSWORD_INPUT = "password-input",
  PASSWORD_ERROR = "password-error",
  SUBMIT_BUTTON = "submit-button",
}

export async function openSignIn(page: Page) {
  await page.goto("/sign-in");
  await page.waitForLoadState("networkidle");

  return {
    fillEmail: async (email: string) => {
      await page.getByTestId(TestId.EMAIL_INPUT).fill(email);
    },
    getEmailError: async () => {
      return await page.getByTestId(TestId.EMAIL_ERROR).textContent();
    },
    fillPassword: async (password: string) => {
      await page.getByTestId(TestId.PASSWORD_INPUT).fill(password);
    },
    getPasswordError: async () => {
      return await page.getByTestId(TestId.PASSWORD_ERROR).textContent();
    },
    clickSubmit: async () => {
      await page.getByTestId(TestId.SUBMIT_BUTTON).click();
      await page.waitForLoadState("networkidle");
    },
  };
}
