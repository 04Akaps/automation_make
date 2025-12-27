import { RealtimeNewsletter } from '../../../domain/realtime-newsletter/entities/RealtimeNewsletter.entity';

export function generateNewsletterHtml(newsletter: RealtimeNewsletter, language: 'ko' | 'en'): string {
  const title = newsletter.title.getValue()[language] || newsletter.title.getValue().ko || newsletter.title.getValue().en || 'Newsletter';
  const summary = newsletter.summary?.getValue()[language] || newsletter.summary?.getValue().ko || newsletter.summary?.getValue().en || '';
  const content = newsletter.content.getValue()[language] || newsletter.content.getValue().ko || newsletter.content.getValue().en || '';
  const publishedAtDate = newsletter.publishedAt.getValue();
  const publishedAt = publishedAtDate ? publishedAtDate.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US') : '';

  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #1a1a1a;
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px 20px;
    }
    .date {
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .summary {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
      color: #555;
      font-weight: 500;
    }
    .body {
      font-size: 15px;
      line-height: 1.8;
      color: #333;
      white-space: pre-wrap;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #999;
      border-top: 1px solid #eee;
    }
    .footer a {
      color: #666;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
    </div>
    <div class="content">
      <div class="date">${publishedAt}</div>
      ${summary ? `<div class="summary">${summary}</div>` : ''}
      <div class="body">${content}</div>
    </div>
    <div class="footer">
      <p>${language === 'ko' ? '이 이메일을 더 이상 받지 않으려면' : 'To unsubscribe from these emails'} <a href="#">${language === 'ko' ? '여기를 클릭하세요' : 'click here'}</a></p>
      <p>&copy; ${new Date().getFullYear()} Crypto Newsletter. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateNewsletterText(newsletter: RealtimeNewsletter, language: 'ko' | 'en'): string {
  const title = newsletter.title.getValue()[language] || newsletter.title.getValue().ko || newsletter.title.getValue().en || 'Newsletter';
  const summary = newsletter.summary?.getValue()[language] || newsletter.summary?.getValue().ko || newsletter.summary?.getValue().en || '';
  const content = newsletter.content.getValue()[language] || newsletter.content.getValue().ko || newsletter.content.getValue().en || '';
  const publishedAtDate = newsletter.publishedAt.getValue();
  const publishedAt = publishedAtDate ? publishedAtDate.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US') : '';

  return `
${title}

${publishedAt}

${summary ? summary + '\n\n' : ''}${content}

---
${language === 'ko' ? '이 이메일을 더 이상 받지 않으려면 구독 취소를 요청하세요.' : 'To unsubscribe, please cancel your subscription.'}
  `.trim();
}
