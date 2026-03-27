---
name: blog-write
description: Draft blog post formatting and publishing skill. Takes raw content (text, .md, or draft post) and restructures it into a standardized format, uploads images to R2, and registers as a draft post via API.
---

# Blog Write Skill

Format raw content into a structured blog post and publish as draft.

## Input

The user provides raw content in any form:
- Direct text in conversation
- A .md file path
- A slug of an existing draft post in the blog

Read the input and identify: topic, key concepts, any images, and reference materials.

## Content Depth Rule (CRITICAL)

The user's draft is a DIRECTION, not a boundary. Always go significantly beyond what was provided:
- Research and add related concepts the user did not mention but should know
- Add practical gotchas, edge cases, and real-world patterns
- Add "알면 좋은 것" sections for deeper understanding
- The user studies these posts repeatedly — more comprehensive = more learning value
- Avoid raw English jargon without Korean explanation (e.g. don't title "스테레오타입 어노테이션" without explaining what stereotype means)
- Use accessible, Korean-friendly titles that anyone can understand at a glance
- Keep English terms in English — write "Stereotype", "Proxy", "Transaction" not "스테레오타입", "프록시", "트랜잭션". 한글 음차 표기 대신 원어 그대로 사용한다.
- NEVER use ASCII art diagrams, tree structures, or arrow-based flow charts (│├└▼→ etc). These look machine-generated. Instead use numbered lists, tables, or plain text to explain flows and processes. The post must look like a human wrote it.

## Output Structure

Every blog post MUST follow this structure:

Refer to the Difficulty Grouping System below for the full HTML structure.

### Section Rules

**목적**: 2-3 sentences. What this post covers and why it matters.

**용어 정리**: Table format. Only include terms that appear in the body. Minimum 3, maximum 10 terms. Each description is one sentence. First column is bold (CSS handles this).

**필수/심화/참고**: Content grouped by difficulty. Each group is `<h2>`, topics inside are `<h3>`, subtopics are `<h4>`. Include code blocks with `<pre><code class="language-xxx">` when relevant. Use `<blockquote>` for official quotes, `<blockquote class="answer">` for explanation callouts.

**참고 자료**: Verified links only. Use WebSearch to find official documentation and reliable sources. Minimum 2 references.

## Difficulty Grouping System

Content MUST be grouped by difficulty level using h2 headers. Individual topics go under h3.

```html
<h2>목적</h2>
<p>...</p>

<h2>용어 정리</h2>
<table>...</table>

<h2><span class="badge-essential">필수</span></h2>
  <h3>Topic A</h3>
  <h3>Topic B</h3>

<h2><span class="badge-deep">심화</span></h2>
  <h3>Topic C</h3>
  <h3>Topic D</h3>

<h2><span class="badge-ref">참고</span></h2>
  <h3>Topic E</h3>

<h2>참고 자료</h2>
<ul>...</ul>
```

Grouping criteria:
- **필수**: Core concepts asked in most interviews, required for daily work. Must memorize.
- **심화**: Differentiators in interviews, helpful for understanding. Read and understand once.
- **참고**: Senior-level depth, knowing it exists is enough. Look up when needed in practice.

## Writing Tone

- Professional but approachable: "~한 것 같다", "~한 구조다", "~할 수 있다"
- No slang: avoid "좋은듯", "ㅋㅋ", "대박" etc.
- No exclamation marks (!)
- No ellipsis (..)
- Short sentences. One idea per sentence.
- Korean for all content. English for code and technical terms only.

### Tone Examples

GOOD:
- "Cloudflare D1을 Next.js에 연동해봤다."
- "REST API 폴백을 추가하면 로컬 개발 환경도 깔끔하게 분리할 수 있다."
- "가볍고 설정이 단순해서 사이드 프로젝트에 적합한 것 같다."

BAD:
- "D1 진짜 좋은듯!" (slang + exclamation)
- "이건 꼭 써봐야 한다.." (ellipsis)
- "완전 편하다!" (exclamation)

## Image Handling

### User-Provided Images
1. If the raw content contains local image paths, upload each to R2 via the upload API:
   - Endpoint: POST /api/upload
   - FormData: file (the image), folder ("blog")
   - Response: { url, key }
2. Replace local image paths in the content with the returned R2 URLs
3. Use `<img src="URL" alt="description" />` format in the HTML content

### AI Image Generation (On Request Only)
When the user explicitly asks for image generation (e.g. "유머 있는 이미지 넣어줘", "소개 이미지 만들어줘"):
1. Use Gemini Imagen API to generate the image
   - API Key: Use GEMINI_API_KEY environment variable
   - Model: gemini-2.0-flash-preview-image-generation (or imagen-3.0-generate-002)
   - Generate a prompt that matches the blog post context
2. Save the generated image locally, then upload to R2
3. Do NOT generate images unless the user explicitly requests it
4. Most of the time the user will provide their own images

## Publishing

After formatting is complete, register the post as a **draft** (published: false):

- Endpoint: POST /api/posts
- Body:
  - title: extracted from content
  - slug: generated from title (lowercase, hyphened, ASCII)
  - content: the formatted HTML
  - thumbnail: first image URL if available, null otherwise
  - category: suggest based on content topic, null if unclear
  - tags: comma-separated relevant tags
  - published: 0 (always draft)

Report the created post slug to the user so they can review and publish manually.

## Slug Generation

Convert the title to a URL-friendly slug:
1. Translate Korean title to a short English equivalent
2. Lowercase, replace spaces with hyphens
3. Remove special characters
4. Max 60 characters
5. Must match pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/

## Checklist

Before publishing as draft:
- [ ] 목적 section exists and is 2-3 sentences
- [ ] 용어 정리 table has 3-10 terms
- [ ] Content grouped under 필수/심화/참고 h2 headers
- [ ] badge-legend div present after 용어 정리
- [ ] 참고 자료 section has 2+ verified links
- [ ] All images uploaded to R2
- [ ] Writing tone matches guidelines (no slang, no !, no ..)
- [ ] No ASCII art diagrams (no │├└▼→ etc)
- [ ] English terms kept in English (not 한글 음차)
- [ ] Slug is valid and unique
- [ ] Post is registered as draft (published: 0)
