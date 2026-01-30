/**
 * 个人导航页 Cloudflare Worker 模板
 * Author: Lollipop
 * Repository: https://github.com/JiaqiaoWoo/cloudflare-worker-dashboard
 */

// =================================================================
// 1. 用户配置区域 (请在此处修改你的登录信息)
// =================================================================
const CONFIG = {
  // 登录用户名和密码
  user: "admin", 
  pass: "password123",
  
  // 网站标题（可根据需要自行更改）
  siteTitle: "My Dashboard",
  siteSubtitle: "个人私有服务控制台",
  
  // Cookie 配置 (通常不需要修改，除非你想改名)
  cookieName: "my_nav_session",
  sessionValue: "authenticated_" + Date.now(), // 简单的随机标识
};

// =================================================================
// 2. 导航链接配置 (请在此处修改你的网址)
// =================================================================

// 核心入口（置顶的大卡片，可设置为自己常用入口，此处以个人博客为例）
const HERO_LINK = { 
  title: "我的个人博客", 
  desc: "一个什么都沾点的个人博客",
  url: "https://example.com" 
};

// 私有服务列表（可以接入个人搭建的任意网址）
const PRIVATE_TOOLS = [
  { title: "2FA 管理", icon: "🔐", url: "https://your-2fa。com" },
  { title: "Team 管理", icon: "👥", url: "https://your-team.com" },
  { title: "服务监控", icon: "🛡️", url: "https://your-status.com" },
  { title: "文件传输", icon: "📦", url: "https://file.your-domain.com" }
];

// 外部社区列表(此处以GitHub和Linux.do为例)
const PUBLIC_LINKS = [
  { title: "GitHub", icon: "🐙", url: "https://github.com" },
  { title: "Linux.do", icon: "🐧", url: "https://linux.do" },
];

// =================================================================
// 3. Worker 核心逻辑 (通常不需要修改)
// =================================================================
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 处理退出登录
    if (url.pathname === "/logout") {
      return new Response("已退出", {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie": `${CONFIG.cookieName}=; Path=/; HttpOnly; Max-Age=0`
        }
      });
    }

    // 处理登录请求
    if (request.method === "POST" && url.pathname === "/login") {
      const formData = await request.formData();
      const user = formData.get("user");
      const pass = formData.get("pass");

      if (user === CONFIG.user && pass === CONFIG.pass) {
        return new Response(null, {
          status: 302,
          headers: {
            "Location": "/",
            "Set-Cookie": `${CONFIG.cookieName}=${CONFIG.sessionValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400` // 24小时有效
          }
        });
      } else {
        return new Response("账号或密码错误", { status: 403 });
      }
    }

    // 检查登录状态
    const cookieHeader = request.headers.get("Cookie") || "";
    if (!cookieHeader.includes(`${CONFIG.cookieName}=${CONFIG.sessionValue}`)) {
      return new Response(renderLoginPage(), {
        headers: { "content-type": "text/html;charset=UTF-8" }
      });
    }

    // 已登录，渲染主页
    return new Response(renderDashboardPage(), {
      headers: { "content-type": "text/html;charset=UTF-8" }
    });
  }
};

// =================================================================
// 4. HTML 渲染函数
// =================================================================

// --- 登录界面 ---
function renderLoginPage() {
  return `
  <!DOCTYPE html>
  <html lang="zh-CN">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login | ${CONFIG.siteTitle}</title>
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
              background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
              color: white;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              display: flex; align-items: center; justify-content: center;
              min-height: 100vh; position: relative; overflow: hidden;
          }
          /* 动态背景网格 */
          body::before {
              content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
              background-image: 
                  linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
              background-size: 50px 50px;
              animation: gridMove 20s linear infinite;
          }
          @keyframes gridMove { 0% { transform: translate(0, 0); } 100% { transform: translate(50px, 50px); } }
          
          .login-card {
              background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px);
              padding: 3rem 2.5rem; border-radius: 24px;
              border: 1px solid rgba(99, 102, 241, 0.3);
              width: 100%; max-width: 400px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
              position: relative; z-index: 1; animation: fadeInUp 0.6s ease-out;
          }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          
          .logo { text-align: center; margin-bottom: 2rem; }
          .logo-icon {
              width: 64px; height: 64px; background: linear-gradient(135deg, #818cf8, #6366f1);
              border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;
              font-size: 32px; margin-bottom: 1rem; box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
          }
          h2 { font-weight: 600; text-align: center; color: #e2e8f0; font-size: 1.5rem; margin-bottom: 0.5rem; }
          .subtitle { text-align: center; color: #94a3b8; font-size: 0.875rem; margin-bottom: 2rem; }
          
          .input-group { margin-bottom: 1.25rem; }
          input {
              width: 100%; padding: 14px 18px; border-radius: 12px;
              border: 1px solid rgba(51, 65, 85, 0.6); background: rgba(15, 23, 42, 0.6);
              color: white; font-size: 1rem; transition: all 0.3s;
          }
          input:focus { outline: none; border-color: #6366f1; background: rgba(15, 23, 42, 0.8); }
          button {
              width: 100%; padding: 14px; border: none; border-radius: 12px;
              background: linear-gradient(135deg, #6366f1, #4f46e5);
              color: white; font-weight: 600; font-size: 1rem; cursor: pointer;
              transition: all 0.3s; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); margin-top: 1rem;
          }
          button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5); }
      </style>
  </head>
  <body>
      <div class="login-card">
          <div class="logo">
              <div class="logo-icon">🚀</div>
              <h2>${CONFIG.siteTitle}</h2>
              <p class="subtitle">欢迎回来，请登录您的账户</p>
          </div>
          <form action="/login" method="POST">
              <div class="input-group">
                  <input type="text" name="user" placeholder="用户名" required autocomplete="username">
              </div>
              <div class="input-group">
                  <input type="password" name="pass" placeholder="密码" required autocomplete="current-password">
              </div>
              <button type="submit">登 录</button>
          </form>
      </div>
  </body>
  </html>`;
}

// --- 主控制台界面 ---
function renderDashboardPage() {
  return `
  <!DOCTYPE html>
  <html lang="zh-CN">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${CONFIG.siteTitle}</title>
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
              background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
              color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              min-height: 100vh; padding: 60px 20px 40px; position: relative; overflow-x: hidden;
          }
          body::before {
              content: ''; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
              background-image: 
                  radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
              pointer-events: none;
          }
          .container { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
          
          header { text-align: center; margin-bottom: 4rem; animation: fadeInDown 0.8s ease-out; }
          h1 {
              font-size: 3rem; font-weight: 700;
              background: linear-gradient(135deg, #818cf8, #c084fc);
              -webkit-background-clip: text; -webkit-text-fill-color: transparent;
              margin-bottom: 0.5rem;
          }
          .subtitle { color: #94a3b8; font-size: 1rem; }
          
          /* 核心卡片样式 */
          .blog-hero {
              background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
              backdrop-filter: blur(10px); border: 1px solid rgba(99, 102, 241, 0.3);
              border-radius: 24px; padding: 3rem 2rem; margin-bottom: 3rem;
              text-align: center; text-decoration: none; color: white; display: block;
              transition: all 0.4s; box-shadow: 0 10px 40px rgba(99, 102, 241, 0.2);
              animation: fadeInUp 0.8s ease-out 0.2s both;
          }
          .blog-hero:hover { transform: translateY(-8px) scale(1.02); border-color: rgba(99, 102, 241, 0.5); }
          .blog-hero-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
          .blog-hero-desc { color: #cbd5e1; font-size: 0.95rem; }
          
          .section-title {
              font-size: 1.25rem; color: #e2e8f0; font-weight: 600; margin: 3rem 0 1.5rem;
              padding-left: 1rem; border-left: 4px solid #6366f1;
              animation: fadeInUp 0.8s ease-out 0.4s both;
          }
          
          .grid {
              display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
              gap: 1.5rem; margin-bottom: 2rem;
          }
          .card {
              background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(10px);
              border: 1px solid rgba(51, 65, 85, 0.6); border-radius: 16px;
              padding: 2rem 1.5rem; text-align: center; text-decoration: none; color: white;
              transition: all 0.3s; display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
              position: relative; overflow: hidden; animation: fadeInUp 0.6s ease-out both;
          }
          .card::before {
              content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
              background: linear-gradient(90deg, #6366f1, #8b5cf6); transform: scaleX(0); transition: transform 0.3s;
          }
          .card:hover::before { transform: scaleX(1); }
          .card:hover { transform: translateY(-8px); background: rgba(30, 41, 59, 0.8); border-color: rgba(99, 102, 241, 0.6); }
          .card-icon { font-size: 2.5rem; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)); }
          .card-title { font-weight: 600; font-size: 1.05rem; color: #e2e8f0; }
          
          /* 简单动画延迟生成 */
          .grid .card:nth-child(1) { animation-delay: 0.5s; }
          .grid .card:nth-child(2) { animation-delay: 0.6s; }
          .grid .card:nth-child(3) { animation-delay: 0.7s; }
          .grid .card:nth-child(4) { animation-delay: 0.8s; }
          
          @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          
          footer { text-align: center; margin-top: 4rem; padding-top: 2rem; border-top: 1px solid rgba(51, 65, 85, 0.5); }
          .logout-btn {
              display: inline-block; color: #94a3b8; text-decoration: none; font-size: 0.9rem;
              padding: 0.5rem 1.5rem; border-radius: 8px; border: 1px solid rgba(51, 65, 85, 0.6); transition: all 0.3s;
          }
          .logout-btn:hover { color: #f87171; border-color: rgba(248, 113, 113, 0.5); background: rgba(248, 113, 113, 0.1); }
          
          @media (max-width: 768px) {
              h1 { font-size: 2rem; }
              .grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <header>
              <h1>${CONFIG.siteTitle}</h1>
              <p class="subtitle">${CONFIG.siteSubtitle}</p>
          </header>
          
          <a href="${HERO_LINK.url}" class="blog-hero">
              <div class="blog-hero-title">${HERO_LINK.title}</div>
              <div class="blog-hero-desc">${HERO_LINK.desc}</div>
          </a>
          
          <h2 class="section-title">🛠️ 私有服务</h2>
          <div class="grid">
              ${PRIVATE_TOOLS.map(t => `
                  <a href="${t.url}" class="card" target="_blank">
                      <div class="card-icon">${t.icon}</div>
                      <div class="card-title">${t.title}</div>
                  </a>
              `).join('')}
          </div>
          
          <h2 class="section-title">🌐 外部社区</h2>
          <div class="grid">
              ${PUBLIC_LINKS.map(c => `
                  <a href="${c.url}" class="card" target="_blank">
                      <div class="card-icon">${c.icon}</div>
                      <div class="card-title">${c.title}</div>
                  </a>
              `).join('')}
          </div>
          
          <footer>
              <a href="/logout" class="logout-btn">退出登录</a>
          </footer>
      </div>
  </body>
  </html>`;
}
