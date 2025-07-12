import { expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { auth } from "@/server/auth.ts";
import { openSignIn } from "./pages/sign-in.ts";

test.describe("when user has account", () => {
  const userData = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
  };

  test.beforeAll("create user", async () => {
    await auth.api.createUser({
      body: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
      },
    });
  });

  test("redirects to home when password correct", async ({ page }) => {
    const signIn = await openSignIn(page);
    await signIn.fillEmail(userData.email);
    await signIn.fillPassword(userData.password);
    await signIn.clickSubmit();
    await expect(page).toHaveURL("/");
  });

  test("shows error when wrong password", async ({ page }) => {
    const signIn = await openSignIn(page);
    await signIn.fillEmail(userData.email);
    await signIn.fillPassword("wrongpassword");
    await signIn.clickSubmit();
    const passwordError = await signIn.getPasswordError();
    await expect(passwordError).toContain("Invalid email or password");
    await expect(page).toHaveURL("/sign-in");
  });
});
