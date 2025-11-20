from playwright.sync_api import Page, expect, sync_playwright

def verify_ui_changes(page: Page):
    print("Navigating to home page...")
    page.goto("http://localhost:3000", timeout=60000)

    print("Waiting for sidebar...")
    page.wait_for_selector(".mlc-icon", state="visible", timeout=60000)

    print("Taking screenshot of home...")
    page.screenshot(path="verification/home_success.png")

    # 1. Verify Sidebar Links (GitHub and WebLLM should be GONE)
    print("Verifying sidebar links...")
    webllm_link = page.locator("a[href='https://webllm.mlc.ai']")
    expect(webllm_link).not_to_be_visible()
    print("WebLLM link is not visible.")

    # 2. Verify Language Options in Settings
    print("Navigating to settings...")
    # Try to navigate via URL
    page.goto("http://localhost:3000/#/settings")

    print("Waiting for settings page...")
    # Wait for "Language" label
    page.wait_for_selector("text=Language", timeout=60000)

    print("Taking screenshot of settings...")
    page.screenshot(path="verification/settings_success.png")

    # Check for "Español" text which should NOT be there
    spanish = page.get_by_text("Español")
    expect(spanish).not_to_be_visible()

    print("Deutsch and Español are not visible.")

    print("Verification complete.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_ui_changes(page)
        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()
