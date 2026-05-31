# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing-page.spec.ts >> Landing Page E2E Tests >> should support visual regression checks
- Location: tests\landing-page.spec.ts:36:7

# Error details

```
Error: expect(locator).toHaveScreenshot(expected) failed

Locator: locator('main > section').first()
  3877 pixels (ratio 0.01 of all image pixels) are different.

Call log:
  - Expect "toHaveScreenshot" with timeout 15000ms
    - verifying given screenshot expectation
  - waiting for locator('main > section').first()
    - locator resolved to <section class="w-full pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden relative">…</section>
  - taking element screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
  - 3877 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - waiting for locator('main > section').first()
    - locator resolved to <section class="w-full pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden relative">…</section>
  - taking element screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
  - captured a stable screenshot
  - 3877 pixels (ratio 0.01 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - navigation [ref=e3]:
      - link "RIXORA" [ref=e4]:
        - /url: /
        - heading "RIXORA" [level=1] [ref=e5]
  - main [ref=e6]:
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]:
          - img [ref=e14]
          - text: Rixora AI Career & Study Hub 2.0
        - heading "Navigate your career trajectory." [level=1] [ref=e17]:
          - text: Navigate your
          - text: career trajectory.
        - paragraph [ref=e18]: Stop guessing what employers want. Let our advanced AI analyze market data, simulate interviews, and build your perfect ATS-optimized resume.
        - link "Start Architecting" [ref=e20]:
          - /url: /dashboard
          - button "Start Architecting" [ref=e22] [cursor=pointer]:
            - generic [ref=e24]:
              - text: Start Architecting
              - img [ref=e26]
      - generic [ref=e31]:
        - generic [ref=e32]:
          - img [ref=e33]
          - generic [ref=e37]: How do I transition from Marketing to Tech inside 6 months?
        - generic [ref=e40]:
          - img [ref=e42]
          - generic [ref=e45]:
            - paragraph [ref=e46]: Based on current 2025 market data, a transition from Marketing to Tech is highly viable if you target Growth Product Management or Developer Relations.
            - generic [ref=e47]:
              - generic [ref=e48]:
                - img [ref=e49]
                - generic [ref=e51]: Learn SQL & Python
              - generic [ref=e52]:
                - img [ref=e53]
                - generic [ref=e57]: Target SaaS Startups
            - paragraph [ref=e58]:
              - img [ref=e59]
              - text: "Estimated salary bump: +24% to 35%"
    - generic [ref=e63]:
      - heading "Powerful Features for Your Career Growth" [level=2] [ref=e65]
      - generic [ref=e66]:
        - generic [ref=e70]:
          - img [ref=e72]
          - heading "AI-Powered Career Guidance" [level=3] [ref=e84]
          - paragraph [ref=e85]: Get personalized career advice and insights powered by advanced AI technology.
        - generic [ref=e89]:
          - img [ref=e91]
          - heading "Interview Preparation" [level=3] [ref=e94]
          - paragraph [ref=e95]: Practice with role-specific questions and get instant feedback to improve your performance.
        - generic [ref=e99]:
          - img [ref=e101]
          - heading "Industry Insights" [level=3] [ref=e104]
          - paragraph [ref=e105]: Stay ahead with real-time industry trends, salary data, and market analysis.
        - generic [ref=e109]:
          - img [ref=e111]
          - heading "Smart Resume Creation" [level=3] [ref=e114]
          - paragraph [ref=e115]: Generate ATS-optimized resumes with AI assistance.
    - generic [ref=e118]:
      - generic [ref=e120]:
        - heading "50+" [level=3] [ref=e121]
        - paragraph [ref=e122]: Industries Covered
      - generic [ref=e124]:
        - heading "1000+" [level=3] [ref=e125]
        - paragraph [ref=e126]: Interview Questions
      - generic [ref=e128]:
        - heading "95%" [level=3] [ref=e129]
        - paragraph [ref=e130]: Success Rate
      - generic [ref=e132]:
        - heading "24/7" [level=3] [ref=e133]
        - paragraph [ref=e134]: AI Support
    - generic [ref=e136]:
      - generic [ref=e138]:
        - heading "How It Works" [level=2] [ref=e139]
        - paragraph [ref=e140]: Four simple steps to accelerate your career growth
      - generic [ref=e141]:
        - generic [ref=e143]:
          - img [ref=e145]
          - heading "Professional Onboarding" [level=3] [ref=e148]
          - paragraph [ref=e149]: Share your industry and expertise for personalized guidance
        - generic [ref=e151]:
          - img [ref=e153]
          - heading "Craft Your Documents" [level=3] [ref=e157]
          - paragraph [ref=e158]: Create ATS-optimized resumes and compelling cover letters
        - generic [ref=e160]:
          - img [ref=e162]
          - heading "Prepare for Interviews" [level=3] [ref=e167]
          - paragraph [ref=e168]: Practice with AI-powered mock interviews tailored to your role
        - generic [ref=e170]:
          - img [ref=e172]
          - heading "Track Your Progress" [level=3] [ref=e175]
          - paragraph [ref=e176]: Monitor improvements with detailed performance analytics
    - generic [ref=e178]:
      - heading "What Our Users Say" [level=2] [ref=e180]
      - generic [ref=e181]:
        - generic [ref=e185]:
          - generic [ref=e186]:
            - img "Sarah Chen" [ref=e188]
            - generic [ref=e189]:
              - paragraph [ref=e190]: Sarah Chen
              - paragraph [ref=e191]: Software Engineer
              - paragraph [ref=e192]: Tech Giant Co.
          - blockquote [ref=e193]:
            - paragraph [ref=e194]:
              - generic [ref=e195]: "\""
              - text: The AI-powered interview prep was a game-changer. Landed my dream job at a top tech company!
              - generic [ref=e196]: "\""
        - generic [ref=e200]:
          - generic [ref=e201]:
            - img "Michael Rodriguez" [ref=e203]
            - generic [ref=e204]:
              - paragraph [ref=e205]: Michael Rodriguez
              - paragraph [ref=e206]: Product Manager
              - paragraph [ref=e207]: StartUp Inc.
          - blockquote [ref=e208]:
            - paragraph [ref=e209]:
              - generic [ref=e210]: "\""
              - text: The industry insights helped me pivot my career successfully. The salary data was spot-on!
              - generic [ref=e211]: "\""
        - generic [ref=e215]:
          - generic [ref=e216]:
            - img "Priya Patel" [ref=e218]
            - generic [ref=e219]:
              - paragraph [ref=e220]: Priya Patel
              - paragraph [ref=e221]: Marketing Director
              - paragraph [ref=e222]: Global Corp
          - blockquote [ref=e223]:
            - paragraph [ref=e224]:
              - generic [ref=e225]: "\""
              - text: My resume's ATS score improved significantly. Got more interviews in two weeks than in six months!
              - generic [ref=e226]: "\""
    - generic [ref=e228]:
      - generic [ref=e230]:
        - heading "Frequently Asked Questions" [level=2] [ref=e231]
        - paragraph [ref=e232]: Find answers to common questions about our platform
      - generic [ref=e235]:
        - heading "What makes Rixora unique as a career development tool?" [level=3] [ref=e237]:
          - button "What makes Rixora unique as a career development tool?" [ref=e238] [cursor=pointer]:
            - text: What makes Rixora unique as a career development tool?
            - img
        - heading "How does Rixora create tailored content?" [level=3] [ref=e240]:
          - button "How does Rixora create tailored content?" [ref=e241] [cursor=pointer]:
            - text: How does Rixora create tailored content?
            - img
        - heading "How accurate and up-to-date are Rixora's industry insights?" [level=3] [ref=e243]:
          - button "How accurate and up-to-date are Rixora's industry insights?" [ref=e244] [cursor=pointer]:
            - text: How accurate and up-to-date are Rixora's industry insights?
            - img
        - heading "Is my data secure with Rixora?" [level=3] [ref=e246]:
          - button "Is my data secure with Rixora?" [ref=e247] [cursor=pointer]:
            - text: Is my data secure with Rixora?
            - img
        - heading "How can I track my interview preparation progress?" [level=3] [ref=e249]:
          - button "How can I track my interview preparation progress?" [ref=e250] [cursor=pointer]:
            - text: How can I track my interview preparation progress?
            - img
        - heading "Can I edit the AI-generated content?" [level=3] [ref=e252]:
          - button "Can I edit the AI-generated content?" [ref=e253] [cursor=pointer]:
            - text: Can I edit the AI-generated content?
            - img
    - generic [ref=e257]:
      - heading "Ready to Accelerate Your Career?" [level=2] [ref=e258]
      - paragraph [ref=e259]: Join thousands of professionals who are advancing their careers with AI-powered guidance.
      - link "Start Your Journey Today" [ref=e260]:
        - /url: /dashboard
        - button "Start Your Journey Today" [ref=e261] [cursor=pointer]:
          - text: Start Your Journey Today
          - img
  - region "Notifications alt+T"
  - contentinfo [ref=e262]:
    - generic [ref=e263]:
      - paragraph [ref=e264]: Made with ❤️ by Vishwas and His Team
      - generic [ref=e265]:
        - link "Visit Rixora on Facebook" [ref=e266]:
          - /url: https://facebook.com
          - img [ref=e267]
        - link "Visit Rixora on Twitter" [ref=e269]:
          - /url: https://twitter.com
          - img [ref=e270]
        - link "Visit Rixora on Instagram" [ref=e272]:
          - /url: https://instagram.com
          - img [ref=e273]
        - link "Visit Rixora on LinkedIn" [ref=e276]:
          - /url: https://linkedin.com
          - img [ref=e277]
    - paragraph [ref=e281]: © 2026 Vishwas & Team. All rights reserved.
  - button "Open Next.js Dev Tools" [ref=e287] [cursor=pointer]:
    - img [ref=e288]
  - alert [ref=e293]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Landing Page E2E Tests', () => {
  4  |   let consoleErrors: string[] = [];
  5  | 
  6  |   test.beforeEach(async ({ page }) => {
  7  |     consoleErrors = [];
  8  |     page.on('console', msg => {
  9  |       if (msg.type() === 'error') {
  10 |         consoleErrors.push(msg.text());
  11 |       }
  12 |     });
  13 | 
  14 |     await page.goto('/', { waitUntil: 'domcontentloaded' });
  15 |     await page.waitForSelector('main', { timeout: 15000 });
  16 |   });
  17 | 
  18 |   test('should render navbar and essential CTA components', async ({ page }) => {
  19 |     const logo = page.getByRole('link', { name: /rixora/i }).first();
  20 |     await expect(logo).toBeVisible();
  21 | 
  22 |     await expect(page.getByText(/navigate your/i)).toBeVisible();
  23 |     await expect(page.getByRole('link', { name: /start architecting/i })).toBeVisible();
  24 |   });
  25 | 
  26 |   test('should verify responsive viewport and mobile navigation menu', async ({ page }) => {
  27 |     await page.setViewportSize({ width: 390, height: 844 });
  28 | 
  29 |     await expect(page.getByRole('link', { name: /rixora/i }).first()).toBeVisible();
  30 |   });
  31 | 
  32 |   test('should verify there are no critical console errors on load', async () => {
  33 |     expect(consoleErrors).toEqual([]);
  34 |   });
  35 | 
  36 |   test('should support visual regression checks', async ({ page }) => {
  37 |     await page.waitForTimeout(5000);
  38 |     await page.addStyleTag({
  39 |       content: '* { animation-duration: 0s !important; transition-duration: 0s !important; }'
  40 |     });
  41 | 
> 42 |     await expect(page.locator('main > section').first()).toHaveScreenshot({ maxDiffPixels: 1200, timeout: 15000 });
     |                                                          ^ Error: expect(locator).toHaveScreenshot(expected) failed
  43 |   });
  44 | });
  45 | 
```