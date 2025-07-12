import { expect, test } from "@playwright/test";
import { openSignIn } from "./pages/sign-in.ts";

test.skip("redirects to home when authenticated successfully", async ({
  page,
}) => {
  const signIn = await openSignIn(page);
  await signIn.fillEmail("test@test.com");
  await signIn.fillPassword("testpassword");
  await signIn.clickSubmit();
  await expect(page).toHaveURL("/");
});

test("shows error when wrong password", async ({ page }) => {
  const signIn = await openSignIn(page);
  await signIn.fillEmail("test@test.com");
  await signIn.fillPassword("wrongpassword");
  await signIn.clickSubmit();
  const passwordError = await signIn.getPasswordError();
  await expect(passwordError).toContain("Invalid email or password");
  await expect(page).toHaveURL("/sign-in");
});
