// /api/chat.js (Vercel Serverless Function 后端代码)
export default async function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只允许 POST 请求' });
    }

    // 接收前端传来的对话历史
    const { messages } = req.body;

    try {
        // 向智谱 GLM-4 发起请求
        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // ⚠️ 核心机密：这里的 API_KEY 是从云端环境变量里读的，别人绝对看不到！
                'Authorization': `Bearer ${process.env.GLM_API_KEY}` 
            },
            body: JSON.stringify({
                model: 'glm-4-flash', // 如果你用的是其他模型，可以在这里改
                messages: messages,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`智谱 API 报错: ${response.status}`);
        }

        const data = await response.json();
        // 把大模型的回答原封不动地返回给前端
        res.status(200).json(data);

    } catch (error) {
        console.error('后端请求错误:', error);
        res.status(500).json({ error: '后端服务器开小差了' });
    }
}